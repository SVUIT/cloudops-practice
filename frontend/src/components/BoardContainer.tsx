import type { Board, Card } from "../types";
import TaskCard from "./TaskCard";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import CardFormModal from "./CardFormModal";
import AddCardButton from "./AddCardButton"; // thêm ở phần import đầu file
import BoardOptionsIcon from "./BoardOptionsIcon";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface Props {
  board: Board;
  cards: Card[];
  deleteBoard: (id: string) => Promise<void>;
  updateBoard: (id: string, data: { title: string; order: number }) => Promise<void>;
  createCard: (boardId: string, card: Partial<Card>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  updateCard: (id: string, card: Partial<Card>) => Promise<void>;
  fetchCards: () => Promise<void>;
  maxCards: number;
}

function BoardContainer({
  board,
  cards,
  deleteBoard,
  updateBoard,
  createCard,
  deleteCard,
  updateCard,
  fetchCards,
  maxCards,
}: Props) {
  const selectedColor = board.color || "#1F1D29";
  const [editMode, setEditMode] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [, setFormData] = useState({
    content: "",
    subjectName: "",
    semester: "",
  });
  const [, setShowDropdown] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: board.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    minHeight: maxCards * 140 + 170,
  };

  const cardsCount = cards.length;

  function resetForm() {
    setFormData({
      content: "",
      subjectName: "",
      semester: "",
    });
    setEditingCard(null);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#2B2B39] w-[350px] border-b border-[#2F2F3C] flex flex-col rounded-xl shadow-xl"
    >
      {/* Header */}
      <div
        className=" h-[60px] rounded-xl p-3 text-md font-bold flex items-center justify-between group mx-2 mt-2 mb-4 relative"
        style={{ backgroundColor: selectedColor }}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <div className="flex gap-2 items-center w-full">
          <div
            className="flex items-center gap-2 w-full cursor-grab"
            {...attributes}
            {...listeners}
          >
            <div className="flex justify-center items-center bg-gray-700 px-2 py-1 text-sm rounded-full text-white">
              {cardsCount}
            </div>

            {!editMode && (
              <span className="text-lg text-white truncate">{board.title}</span>
            )}
            {editMode && (
              <input
                className="bg-black focus:border-rose-500 border rounded outline-none px-2 text-white w-full"
                value={board.title}
                onChange={(e) =>
                  updateBoard(board.id, {
                    title: e.target.value,
                    order: board.order,
                  })
                }
                autoFocus
                onBlur={() => setEditMode(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setEditMode(false);
                }}
              />
            )}
          </div>

          <div className="relative flex items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
            <AddCardButton
              onClick={() => setShowCardForm(true)}
              showLabel={false}
              children={undefined}
            />

            <BoardOptionsIcon
              board={board}
              deleteBoard={deleteBoard}
              setEditMode={setEditMode}
            />
          </div>
        </div>
      </div>

      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-grow flex-col gap-4 p-2 overflow-y-auto">
          {cards.map((card) => (
            <TaskCard
              key={card.id}
              card={card}
              deleteCard={deleteCard}
              onEdit={(card) => {
                setFormData({
                  content: card.content,
                  subjectName: card.subjectName,
                  semester: card.semester,
                });
                setEditingCard(card);
                setShowCardForm(true);
              }}
            />
          ))}
        </div>
      </SortableContext>

      <AddCardButton
        onClick={() => setShowCardForm(true)}
        showLabel
        className="text-md text-gray-500 hover:text-white rounded-md px-6 py-4"
      >
        Add card
      </AddCardButton>

      <CardFormModal
        isOpen={showCardForm}
        onClose={() => {
          setShowCardForm(false);
          resetForm();
        }}
        onSave={async (data) => {
          if (editingCard) {
            await updateCard(editingCard.id, data);
            await fetchCards();
          } else {
            await createCard(board.id, { ...data, order: cards.length + 1 });
          }
        }}
        defaultValues={editingCard || undefined}
        isEditMode={!!editingCard}
      />
    </div>
  );
}

export default BoardContainer;
