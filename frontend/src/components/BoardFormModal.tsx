import { useEffect, useState } from "react";
import type { Board } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Board>) => void;
  defaultValues?: Partial<Board>;
  isEditing?: boolean;
  board?: Board;
  editingBoard?: Board;
}

function BoardFormModal({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  isEditing = false,
}: Props) {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("#9198A1");

  const colors = [
    "#7F8CFF", // pastel tím xanh 
    "#49D2CF", // pastel teal
    "#FF8C42", // pastel cam rực 
    "#F85149", // pastel đỏ san hô
    "#DB61A2", // pastel hồng tím
    "#AB7DF8", // pastel tím nhạt
    "#55B37A", // pastel xanh lá tươi
    "#D29922", // pastel vàng ấm
  ];

  useEffect(() => {
    if (isOpen) {
      if (defaultValues) {
        setTitle(defaultValues.title || "");
        setSelectedColor(defaultValues.color || "#9198A1");
      } else {
        setTitle("");
        setSelectedColor("#9198A1");
      }
    }
  }, [defaultValues, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, color: selectedColor });
    if (!isEditing) {
      setTitle("");
      setSelectedColor("#9198A1");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "#21283066" }}
    >
      <div className="bg-[#1F1D29] bg-opacity-20 p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">
          {isEditing ? "Edit Board" : "Add Board"}
        </h2>
        <hr className="border-gray-500 mb-4" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm text-gray-300" htmlFor="board-title">
            Board title *
          </label>
          <input
            type="text"
            placeholder="Enter board title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-500 px-4 py-2 rounded text-white"
          />

          {/* Color picker */}
          <label className="text-sm text-gray-300">Color</label>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 rounded cursor-pointer border-2 ${
                  selectedColor === color ? "border-white" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-500 bg-[#3A374A] rounded hover:bg-gray-400 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-gray-500 bg-[#238636] text-white rounded hover:bg-[#55B37A]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BoardFormModal;
