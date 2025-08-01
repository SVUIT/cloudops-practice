//TaskCard.tsx

import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import type { Card } from "../types";

interface Props {
  card: Card;
  deleteCard: (id: string) => Promise<void>;
  updateCard: (id: string, card: Partial<Card>) => Promise<void>;
}

function TaskCard({ card, deleteCard, updateCard }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [localCard, setLocalCard] = useState<Card>(card);

  // Sync localCard if prop changes (optional)
  // You can add useEffect if cards update from parent

  function handleChange(field: keyof Card, value: any) {
    setLocalCard((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    try {
      await updateCard(card.id, localCard);
      setEditMode(false);
    } catch (error) {
      console.error("Update card failed:", error);
      alert("Failed to update card");
    }
  }

  if (editMode) {
    return (
      <div className="bg-gray-800 p-2.5 min-h-[120px] flex flex-col rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative">
        <textarea
          className="mb-2 h-[40px] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={localCard.content}
          autoFocus
          placeholder="Content"
          onChange={(e) => handleChange("content", e.target.value)}
        />
        <textarea
          className="mb-2 h-[40px] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={localCard.description ?? ""}
          placeholder="Description"
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <input
          type="text"
          className="mb-2 w-full border rounded bg-transparent text-white focus:outline-none"
          value={localCard.subjectName}
          placeholder="Subject Name"
          onChange={(e) => handleChange("subjectName", e.target.value)}
        />
        <input
          type="text"
          className="mb-2 w-full border rounded bg-transparent text-white focus:outline-none"
          value={localCard.semester}
          placeholder="Semester"
          onChange={(e) => handleChange("semester", e.target.value)}
        />
        <input
          type="text"
          className="mb-2 w-full border rounded bg-transparent text-white focus:outline-none"
          value={localCard.typeSubject}
          placeholder="Type Subject"
          onChange={(e) => handleChange("typeSubject", e.target.value)}
        />
        <input
          type="date"
          className="mb-2 w-full border rounded bg-transparent text-white focus:outline-none"
          value={localCard.dueDate ? localCard.dueDate.substring(0, 10) : ""}
          onChange={(e) => handleChange("dueDate", e.target.value)}
        />
        <input
          type="text"
          className="mb-2 w-full border rounded bg-transparent text-white focus:outline-none"
          value={localCard.labels?.join(", ") ?? ""}
          placeholder="Labels"
          onChange={(e) =>
            handleChange(
              "labels",
              e.target.value
                .split(",")
                .map((l) => l.trim())
                .filter((l) => l.length > 0)
            )
          }
        />
        <div className="flex justify-between">
          <button
            className="stroke-white bg-gray-500 p-2 rounded opacity-60 hover:opacity-100"
            onClick={handleSave}
          >
            Done
          </button>
          <button
            className="stroke-white bg-red-600 p-2 rounded opacity-60 hover:opacity-100"
            onClick={() => {
              setEditMode(false);
              setLocalCard(card); // revert changes
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#23232a] p-2.5 min-h-[120px] flex flex-col rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-pointer relative"
      onClick={() => setEditMode(true)}
    >
      <p className="font-bold text-white">{card.content}</p>
      <p className="text-gray-300">{card.description}</p>
      <p className="text-gray-400">Subject: {card.subjectName}</p>
      <p className="text-gray-400">Semester: {card.semester}</p>
      <p className="text-gray-400">Type: {card.typeSubject}</p>
      <p className="text-gray-400">
        Due: {card.dueDate ? card.dueDate.substring(0, 10) : "N/A"}
      </p>
      <p className="text-gray-400">Labels: {card.labels?.join(", ")}</p>
      <div className="absolute right-4 top-2 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditMode(true);
          }}
          className="stroke-white bg-gray-500 p-2 rounded opacity-60 hover:opacity-100"
          aria-label="Edit Card"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteCard(card.id);
          }}
          className="stroke-white bg-gray-500 p-2 rounded opacity-60 hover:opacity-100"
          aria-label="Delete Card"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
