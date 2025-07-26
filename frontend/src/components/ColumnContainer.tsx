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

    createTask: (columnId: Id, content?: string) => void;
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

    const [showTaskForm, setShowTaskForm] = useState(false);

    const [formData, setFormData] = useState({
        subjectName: "",
        semester: "",
        subjectType: ""
    });

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
                        text-white
                    "
                >
                    {tasks.length}
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

            {showTaskForm && (
                <div className="fixed inset-0 bg-white/30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md space-y-4">
                        <h2 className="text-xl font-semibold text-center text-black">Add New Task</h2>

                        <input
                            type="text"
                            placeholder="Subject Name"
                            className="w-full p-2 border rounded text-black"
                            value={formData.subjectName}
                            onChange={(e) =>
                                setFormData({ ...formData, subjectName: e.target.value })
                            }
                        />

                        <select
                            className="w-full p-2 border rounded text-black"
                            value={formData.semester}
                            onChange={(e) =>
                                setFormData({ ...formData, semester: e.target.value })
                            }
                        >
                            <option value="">Select Semester</option>
                            <option value="Semester 1">Semester 1</option>
                            <option value="Semester 2">Semester 2</option>
                        </select>

                        <select
                            className="w-full p-2 border rounded text-black"
                            value={formData.subjectType}
                            onChange={(e) =>
                                setFormData({ ...formData, subjectType: e.target.value })
                            }
                        >
                            <option value="">Select Type</option>
                            <option value="Core">a</option>
                            <option value="Elective">b</option>
                        </select>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                onClick={() => setShowTaskForm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                                onClick={() => {
                                    const content = `${formData.subjectName}\nSemester: ${formData.semester}\nType: ${formData.subjectType}`;
                                    createTask(column.id, content);
                                    setFormData({
                                        subjectName: "",
                                        semester: "",
                                        subjectType: ""
                                    });
                                    setShowTaskForm(false);
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
        {/* Column footer */}
        <button
            className="text-black flex gap-2 items-center 
                border-gray-50 border-2 rounded-md p-4
                border-x-gray-50
                hover:bg-gray-600 hover:text-white
                active:bg-black"
            onClick={() => setShowTaskForm(true)}
        >
            <PlusIcon />
            Add task
        </button>

    </div>
    );
}

export default ColumnContainer;