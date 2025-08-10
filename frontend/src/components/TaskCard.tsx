import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "../types";
import CardOptionsIcon from "./CardOptionsIcon";

interface Props {
  card: Card;
  deleteCard: (id: string) => Promise<void>;
  onEdit: (card: Card) => void;
}

function TaskCard({ card, deleteCard, onEdit }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(card.id) });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 9999 : "auto",
    pointerEvents: isDragging ? "none" : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group bg-[#1F1D29] p-2.5 w-full min-h-[120px] flex flex-col justify-center space-y-1 rounded-xl shadow-sm hover:shadow-[0_0_12px_rgba(0,0,0,0.3)] transition-shadow duration-200 relative cursor-pointer"
    >
      <CardOptionsIcon card={card} onEdit={onEdit} deleteCard={deleteCard} />

      <p className="text-md text-gray-500 ml-1">{card.semester}</p>
      <p className="text-lg font-bold text-white ml-1">{card.content}</p>
      <p className="text-md text-gray-500 ml-1">{card.subjectName}</p>
    </div>
  );
}

export default TaskCard;
