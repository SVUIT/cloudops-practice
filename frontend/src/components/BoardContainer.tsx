//BoardContainer.tsx

import PlusIcon from "../icons/PlusIcon";
import TrashIcon from "../icons/TrashIcon";
import type { Board, Card } from "../types";
import TaskCard from "./TaskCard";
import { useState, useMemo } from "react";

interface Props {
  board: Board;
  deleteBoard: (id: string) => Promise<void>;
  updateBoard: (id: string, title: string) => Promise<void>;
  createCard: (boardId: string, card: Partial<Card>) => Promise<Card | undefined>;
  deleteCard: (id: string) => Promise<void>;
  updateCard: (id: string, card: Partial<Card>) => Promise<void>;
  cards: Card[];
}

function BoardContainer(props: Props) {
  const { board, deleteBoard, updateBoard, createCard, deleteCard, updateCard, cards } = props;

  const [editMode, setEditMode] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    description: "",
    subjectName: "",
    semester: "",
    typeSubject: "",
    dueDate: "",
    labels: "",
  });

  const cardsCount = cards.length;

  // Reset form data
  function resetForm() {
    setFormData({
      content: "",
      description: "",
      subjectName: "",
      semester: "",
      typeSubject: "",
      dueDate: "",
      labels: "",
    });
  }

  async function handleSaveCard() {
  if (!formData.content.trim()) {
    alert("Content is required");
    return;
  }

  try {
    await createCard(board.id, {
      content: formData.content,
      description: formData.description,
      subjectName: formData.subjectName,
      semester: formData.semester,
      typeSubject: formData.typeSubject,
      dueDate: formData.dueDate,
      labels: formData.labels
        ? formData.labels.split(",").map((l) => l.trim()).filter((l) => l.length > 0)
        : [],
      order: cards.length + 1,
    });

    resetForm();
    setShowCardForm(false); // ✅ đóng form sau khi thêm
  } catch (error) {
    console.error("Create card failed:", error);
    alert("Failed to add card");
  }
}


  return (
    <div className="bg-[#2E2E36] border border-[#4A515B] w-[350px] h-[500px] flex flex-col rounded-xl shadow-lg">
      <div
        className="bg-[#23232a] h-[60px] cursor-pointer rounded-xl p-3 text-md font-bold flex items-center justify-between"
        onClick={() => setEditMode(true)}
      >
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center bg-gray-700 px-2 py-1 text-sm rounded-full text-white">
            {cardsCount}
          </div>
          {!editMode && <span>{board.title}</span>}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2 text-white"
              value={board.title}
              onChange={(e) => updateBoard(board.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteBoard(board.id);
          }}
          className="stroke-gray-200 hover:stroke-white hover:bg-gray-200 rounded px-1 py-2"
          aria-label="Delete Board"
        >
          <TrashIcon />
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-y-auto">
        {cards.map((card) => (
          <TaskCard
            key={card.id}
            card={card}
            deleteCard={deleteCard}
            updateCard={updateCard}
          />
        ))}

        {showCardForm && (
          <div className="fixed inset-0 bg-white/30 flex justify-center items-center z-50">
            <div className="bg-[#2E2E36] p-6 rounded-xl shadow-lg w-[90%] max-w-md space-y-4">
              <h2 className="text-xl font-semibold text-center text-white">Add New Card</h2>
              <input
                type="text"
                placeholder="Content"
                className="w-full p-2 border rounded bg-black text-white"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                className="w-full p-2 border rounded bg-black text-white"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Subject Name"
                className="w-full p-2 border rounded bg-black text-white"
                value={formData.subjectName}
                onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Semester"
                className="w-full p-2 border rounded bg-black text-white"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              />
              <input
                type="text"
                placeholder="Type Subject"
                className="w-full p-2 border rounded bg-black text-white"
                value={formData.typeSubject}
                onChange={(e) => setFormData({ ...formData, typeSubject: e.target.value })}
              />
              <input
                type="date"
                className="w-full p-2 border rounded bg-black text-white"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
              <input
                type="text"
                placeholder="Labels (comma separated)"
                className="w-full p-2 border rounded bg-black text-white"
                value={formData.labels}
                onChange={(e) => setFormData({ ...formData, labels: e.target.value })}
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  onClick={() => {
                    resetForm();
                    setShowCardForm(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleSaveCard}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        className="text-black flex gap-2 items-center border-gray-50 border-2 rounded-md p-4 hover:bg-gray-600 hover:text-white active:bg-black"
        onClick={() => setShowCardForm(true)}
        aria-label="Add Card"
      >
        <PlusIcon />
        Add card
      </button>
    </div>
  );
}

export default BoardContainer;
