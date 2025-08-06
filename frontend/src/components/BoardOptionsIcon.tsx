import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import type { Board } from "../types";
import BoardFormModal from "./BoardFormModal";
import { fetchBoards, updateBoard } from "../api/boardApi";
import EditIcon from "../icons/EditIcon";
import OptionIcon from "../icons/OptionIcon";

interface BoardOptionsIconProps {
  board: Board;
  deleteBoard: (id: string) => void;
  setEditMode: (value: boolean) => void;
}

const BoardOptionsIcon = ({
  board,
  deleteBoard,
}: BoardOptionsIconProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown(!showDropdown);
        }}
        className="p-2 rounded hover:bg-gray-600 text-white"
        title="Board options"
      >
        <OptionIcon />
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-10 bg-[#1F1D29] text-white border border-gray-600 rounded-lg shadow-md z-20 w-32">
          <div className="flex flex-col gap-y-1">
            <div className="px-4 py-2 text-xs text-gray-300 mt-2 mb-2">
              Board options
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 w-full text-left"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditModalOpen(true); 
                setShowDropdown(false);
              }}
            >
              <EditIcon /> Edit
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 hover:bg-red-700/20 w-full text-left mb-4"
              onClick={(e) => {
                e.stopPropagation();
                deleteBoard(board.id);
                setShowDropdown(false);
              }}
            >
              <TrashIcon /> Delete
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <BoardFormModal
          key={board.id} 
          isOpen={true}
          onClose={() => setIsEditModalOpen(false)}
          isEditing={true}
          defaultValues={{ title: board.title, color: board.color }}
          onSubmit={async (data) => {
            if (!data.title) return;
            await updateBoard(board.id, {
              title: data.title,
              color: data.color || board.color, 
              order: board.order,
            });
            setIsEditModalOpen(false);
            fetchBoards(); 
          }}
        />
      )}
    </div>
  );
};

export default BoardOptionsIcon;
