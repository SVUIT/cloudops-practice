import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import type { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props{
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;

    createTask: (columnId: Id) => void;
    updateTask: (id: Id, content: string) => void;
    deleteTask: (id: Id) => void;
    tasks: Task[];
}

function ColumnContainer(props: Props) {
    const { 
        column, 
        deleteColumn, 
        updateColumn, 
        createTask, 
        tasks, 
        deleteTask, 
        updateTask 
    } = props;

    const [editMode, setEditMode] = useState(false);

    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);

    const { 
        setNodeRef, 
        attributes, 
        listeners, 
        transform, 
        transition, 
        isDragging 
    } = useSortable({
            id: column.id,
            data: {
                type: "Column",
                column,
            },
            disabled: editMode,
        });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div 
                ref={setNodeRef} 
                style={style}
                className="
                    bg-gray-200
                    opacity-60
                    border-2
                    border-gray-400
                    w-[350px]
                    h-[500px]
                    max-h-[500px]
                    rounded-md
                    flex
                    flex-col
            "
            >

            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="
                bg-gray-200
                w-[350px]
                h-[500px]
                max-h-[500px]
                rounded-mg
                flex
                flex-col
            "
        >
        {/* Column title */}
        <div 
            {...attributes}
            {...listeners}
            onClick={() => {
                setEditMode(true);
            }}
        
            className="
                bg-gray-500
                h-[60px]
                cursor-grab
                rounded-md
                rounded-b-none
                p-3
                text-md
                font-bold
                border-white
                border-4
                flex
                items-center
                justify-between
        ">
            <div className="flex gap-2">
                <div
                    className="
                        flex
                        justify-center
                        items-center
                        bg-gray-700
                        px-2
                        py-1
                        text-sm
                        rounded-full
                    "
                >
                    0
                </div>
                {!editMode && column.title}
                {editMode && (
                    <input 
                        className="bg-black focus:border-rose-500 border rounded outline-none px-2"
                        value={column.title}
                        onChange={(e) => updateColumn(column.id, e.target.value)}
                        autoFocus
                        onBlur={() => {
                            setEditMode(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key !== "Enter") return;
                            setEditMode(false);
                        }}
                    />
                )}
            </div>
            <button
                onClick={() => {
                    deleteColumn(column.id);
                }}
                className="
                    stroke-gray-200
                    hover:stroke-white
                    hover:bg-gray-200
                    rounded
                    px-1
                    py-2
                "
            >
                <TrashIcon />
            </button>
        </div>
        {/* Column task container */}
        <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
            <SortableContext items={tasksIds}>
                {tasks.map((task) => (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        deleteTask={deleteTask} 
                        updateTask={updateTask}
                        />
                ))} 
            </SortableContext>
        </div>
        {/* Column footer */}
        <button className="flex gap-2 items-center 
        border-gray-50 border-2 rounded-md p-4
        border-x-gray-50
        hover:bg-gray-300 hover:text-rose-50
        active:bg-black"
            onClick={() => {
                createTask(column.id);
            }}
        >
            <PlusIcon />
            Add task
        </button>
    </div>
    );
}

export default ColumnContainer;