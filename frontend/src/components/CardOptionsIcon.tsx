import { useState } from "react";
import type { Card } from "../types";
import EditIcon from "../icons/EditIcon";
import TrashIcon from "../icons/TrashIcon";
import OptionIcon from "../icons/OptionIcon";

interface Props {
  card: Card;
  onEdit: (card: Card) => void;
  deleteCard: (id: string) => void;
}

function CardOptionsIcon({ card, onEdit, deleteCard }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="absolute right-4 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen((prev) => !prev);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="text-white text-lg px-2 rounded hover:bg-gray-600"
      >
        <OptionIcon />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-10 bg-[#1F1D29] text-white border border-gray-600 rounded-lg shadow-md z-20 w-32">
          <div className="flex flex-col gap-y-1">
          <div className="px-4 py-2 text-xs text-gray-300 mt-2 mb-2">
            Card options
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(false);
              onEdit(card);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 w-full text-left"
          >
            <EditIcon /> Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(false);
              deleteCard(card.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-4 py-2 hover:bg-red-700/20 w-full text-left mb-4"
          >
            <TrashIcon /> Delete
          </button>
        </div>
        </div>
      )}
    </div>
  );
}

export default CardOptionsIcon;
