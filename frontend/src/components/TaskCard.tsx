import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import type { Id, Task } from "../types";
import {CSS} from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

interface Props {
    task: Task;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const { 
        setNodeRef, 
        attributes, 
        listeners, 
        transform, 
        transition, 
        isDragging 
        } = useSortable({
            id: task.id,
            data: {
                type: "Task",
                task,
            },
            disabled: editMode,
        });

    const style = {
            transition,
            transform: CSS.Transform.toString(transform),
        };
    
    const  toggleEditMode = () => {
        setEditMode((prev) => !prev);
        setMouseIsOver(false);
    };

    if (isDragging) {
        return (
            <div 
                ref={setNodeRef} 
                style={style} 
                className="opacity-30 bg-gray-800 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500 cursor-grab relative"
            />
        );
    }

    if(editMode) {
        return (
        <div 
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-gray-800 p-2.5 h-[100px] 
            min-h-[100px] items-center flex text-left rounded-xl
            hover:ring-2 hover:ring-inset hover:ring-rose-500
            cursor-grab relative task"
            >
                <textarea 
                    className="
                        h-[90%]
                        w-full resize-none border-none rounded bg-transparent
                        text-white focus:outline-none
                        "
                            value={task.content}
                            autoFocus
                            placeholder="Task content here"
                            onBlur={toggleEditMode}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && e.shiftKey) {
                                    toggleEditMode();
                                }
                            }}
                            onChange={(e) => updateTask(task.id, e.target.value)}
                        >

                </textarea>
            </div>
    )}

    return (
        <div 
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={toggleEditMode}
        className="bg-gray-800 p-2.5 h-[100px] 
        min-h-[100px] items-center flex text-left rounded-xl
        hover:ring-2 hover:ring-inset hover:ring-rose-500
        cursor-grab relative"
        onMouseEnter={() =>  {
            setMouseIsOver(true);
        }}
        onMouseLeave={() => {
            setMouseIsOver(false);
        }}
        >
            <p className="my-auto h-[90%] w-full overflow-y-auto
            overflow-x-hidden whitespace-pre-wrap">
                {task.content}
            </p>
            {mouseIsOver && ( 
                <button 
                onClick={() => {
                    deleteTask(task.id);
                }}
                className="stroke-white absolute right-4 top-1/2-translate-y-1/2 bg-gray-500 p-2 rounded opacity-60 hover:opacity-100">
                <TrashIcon />
            </button>
            )}
        </div>
    )
}

export default TaskCard;