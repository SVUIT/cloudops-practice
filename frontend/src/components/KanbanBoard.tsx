import { useState, useMemo } from "react";
import PlusIcon from "../icons/PlusIcon";
import type { Board, Id, Task } from "../types";
import BoardContainer from "./BoardContainer";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function KanbanBoard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const boardsId = useMemo(() => boards.map((b) => b.id), [boards]);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  return (
    <div className="w-full px-10 py-6 bg-[#18181b] min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Projects
          <button
            onClick={createNewBoard}
            className="ml-2 p-1 rounded-full hover:bg-gray-200"
          >
            <PlusIcon />
          </button>
        </h1>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="bg-[#23232a] border border-gray-700 rounded-xl shadow-md p-6 overflow-x-auto w-full">
          <div className="flex gap-4">
            <SortableContext items={boardsId}>
              {boards.map((board) => (
                <BoardContainer
                  key={board.id}
                  board={board}
                  deleteBoard={deleteBoard}
                  updateBoard={updateBoard}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.boardId === board.id)}
                />
              ))}
            </SortableContext>
          </div>
        </div>

        {createPortal(
          <DragOverlay>
            {activeBoard && (
              <BoardContainer
                board={activeBoard}
                deleteBoard={deleteBoard}
                updateBoard={updateBoard}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter((task) => task.boardId === activeBoard.id)}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createTask(boardId: Id, content?: string) {
    const newTask: Task = {
      id: generateId(),
      boardId,
      content: content ?? `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  function createNewBoard() {
    const boardToAdd: Board = {
      id: generateId(),
      title: `Board ${boards.length + 1}`,
    };

    setBoards([...boards, boardToAdd]);
  }

  function deleteBoard(id: Id) {
    const filteredBoards = boards.filter((b) => b.id !== id);
    setBoards(filteredBoards);

    const newTasks = tasks.filter((t) => t.boardId !== id);
    setTasks(newTasks);
  }

  function updateBoard(id: Id, title: string) {
    const newBoards = boards.map((b) => {
      if (b.id !== id) return b;
      return { ...b, title };
    });

    setBoards(newBoards);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Board") {
      setActiveBoard(event.active.data.current.board);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveBoard(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeBoardId = active.id;
    const overBoardId = over.id;

    if (activeBoardId === overBoardId) return;

    setBoards((boards) => {
      const activeBoardIndex = boards.findIndex((b) => b.id === activeBoardId);
      const overBoardIndex = boards.findIndex((b) => b.id === overBoardId);
      return arrayMove(boards, activeBoardIndex, overBoardIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].boardId = tasks[overIndex].boardId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverABoard = over.data.current?.type === "Board";

    if (isActiveTask && isOverABoard) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].boardId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  return Math.floor(Math.random() * 1001);
}

export default KanbanBoard;
