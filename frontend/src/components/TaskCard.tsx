import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import type { Card } from "../types";

interface Props {
  card: Card;
  deleteCard: (id: string) => void;
  updateCard: (id: string, card: Partial<Card>) => void;
}

function TaskCard({ card, deleteCard, updateCard }: Props) {
  const [editMode, setEditMode] = useState(false);

  if (editMode) {
    return (
      <div className="bg-gray-800 p-2.5 min-h-[120px] flex flex-col rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative">
        <textarea
          className="mb-2 h-[40px] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={card.content}
          autoFocus
          placeholder="Content"
          onBlur={() => setEditMode(false)}
          onChange={(e) => updateCard(card.id, { content: e.target.value })}
        />
        <textarea
          className="mb-2 h-[40px] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={card.description ?? ""}
          placeholder="Description"
          onChange={(e) => updateCard(card.id, { description: e.target.value })}
        />
        <input
          type="text"
          className="mb-2 w-full border rounded bg-transparent text-white focus:outline-none"
          value={card.subjectName}
          placeholder="Subject Name"
          onChange={(e) => updateCard(card.id, { subjectName: e.target.value })}
        />
        <input
          type="text"
          className="mb-2 w-full border rounded bg-transparent text-white focus:outline-none"
          value={card.semester}
          placeholder="Semester"
          onChange={(e) => updateCard(card.id, { semester: e.target.value })}
        />
        <input
          type="text"
          className="mb-2 w-full border rounded bg-transparent text-white focus:outline-none"
          value={card.typeSubject}
          placeholder="Type Subject"
          onChange={(e) => updateCard(card.id, { typeSubject: e.target.value })}
        />
        <input
          type="date"
          className="mb-2 w-full border rounded bg-transparent text-white focus:outline-none"
          value={card.dueDate ? card.dueDate.substring(0, 10) : ""}
          onChange={(e) => updateCard(card.id, { dueDate: e.target.value })}
        />
        <input
          type="text"
          className="mb-2 w-full border rounded bg-transparent text-white focus:outline-none"
          value={card.labels?.join(", ")}
          placeholder="Labels"
          onChange={(e) => updateCard(card.id, { labels: e.target.value.split(",").map((l) => l.trim()) })}
        />
        <button
          className="stroke-white bg-gray-500 p-2 rounded opacity-60 hover:opacity-100"
          onClick={() => setEditMode(false)}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div
      className="bg-[#23232a] p-2.5 min-h-[120px] flex flex-col rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      onClick={() => setEditMode(true)}
    >
      <p className="font-bold">{card.content}</p>
      <p>{card.description}</p>
      <p>Subject: {card.subjectName}</p>
      <p>Semester: {card.semester}</p>
      <p>Type: {card.typeSubject}</p>
      <p>Due: {card.dueDate ? card.dueDate.substring(0, 10) : "N/A"}</p>
      <p>Labels: {card.labels?.join(", ")}</p>
      <div className="absolute right-4 top-2 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditMode(true);
          }}
          className="stroke-white bg-gray-500 p-2 rounded opacity-60 hover:opacity-100"
        >
          Edit
        </button>
        <button
          onClick={() => deleteCard(card.id)}
          className="stroke-white bg-gray-500 p-2 rounded opacity-60 hover:opacity-100"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

export default TaskCard;