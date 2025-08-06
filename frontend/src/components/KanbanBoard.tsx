import { useEffect, useState } from "react";
import type { Board, Card } from "../types";
import BoardFormModal from "./BoardFormModal"; 
import DragAndDropWrapper from "./DragAndDropWrapper";
import AddBoardButton from "./AddBoardButton"; 

import {
  fetchBoards,
  createBoard as apiCreateBoard,
  deleteBoard as apiDeleteBoard,
  updateBoard as apiUpdateBoard,
} from "../api/boardApi";
import {
  fetchCards,
  createCard as apiCreateCard,
  deleteCard as apiDeleteCard,
  updateCard as apiUpdateCard,
} from "../api/cardApi";

import {
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
} from "@dnd-kit/sortable";

function KanbanBoard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);

  const [projectTitle, setProjectTitle] = useState("CloudOps-Practice");
  const [isEditingProjectTitle, setIsEditingProjectTitle] = useState(false);

  useEffect(() => {
    Promise.all([fetchBoards(), fetchCards()]).then(([b, c]) => {
      setBoards(b);
      setCards(c);
    });
  }, []);

  const handleAddBoard = () => {
    setEditingBoard(null); 
    setIsBoardModalOpen(true);
  };

  const handleSubmitBoard = async (data: Partial<Board>) => {
    let createdBoard: Board | null = null;

    if (editingBoard) {
      await apiUpdateBoard(editingBoard.id, {
        ...editingBoard,
        ...data,
      });
    } else {
      createdBoard = await apiCreateBoard({
        ...data,
        order: boards.length + 1,
      });
      console.log("Created board response:", createdBoard);

      if (!createdBoard?.id) {
        const latestBoards = await fetchBoards();
        createdBoard = latestBoards[latestBoards.length - 1];
      }

      if (createdBoard) {
        try {
          await apiCreateCard({
            boardId: createdBoard.id,
            content: "New Task",
            description: "",
            subjectName: "Sample Subject",
            semester: "2025-A",
            typeSubject: "General",
            order: 0,
            isArchived: false,
            labels: [],
          });
        } catch (error) {
          console.error("Failed to create default card:", error);
        }
      }
    }

    const [latestBoards, latestCards] = await Promise.all([
      fetchBoards(),
      fetchCards(),
    ]);
    setBoards(latestBoards);
    setCards(latestCards);
    setIsBoardModalOpen(false);
    setEditingBoard(null);
  };

  const getCardsByBoard = (boardId: string) =>
    cards
      .filter((card) => card.boardId === boardId)
      .sort((a, b) => a.order - b.order);

  const maxCardsPerBoard = Math.max(
    ...boards.map((board) => getCardsByBoard(board.id).length),
    0
  );

  async function handleDragEnd(event: DragEndEvent) {
    const activeId = String(event.active.id);
    const overId   = String(event.over?.id);
    if (!overId || activeId === overId) return;

    const activeCardData = cards.find((card) => card.id === activeId);
    const overCardData   = cards.find((card) => card.id === overId);
    const activeBoardData = boards.find((b) => String(b.id) === activeId);
    const overBoardData   = boards.find((b) => String(b.id) === overId);

    if (activeCardData) {
      const activeBoardId = activeCardData.boardId;

      if (overCardData) {
        const overBoardId = overCardData.boardId;

        if (activeBoardId === overBoardId) {
          const boardCards = getCardsByBoard(activeBoardId);
          const oldIndex   = boardCards.findIndex((c) => c.id === activeId);
          const newIndex   = boardCards.findIndex((c) => c.id === overId);
          const newCards   = arrayMove(boardCards, oldIndex, newIndex);

          setCards((prev) =>
            prev.map((c) => {
              const updated = newCards.find((nc) => nc.id === c.id);
              return updated ? { ...c, order: newCards.indexOf(updated) + 1 } : c;
            })
          );

          await Promise.all(
            newCards.map((card, index) =>
              apiUpdateCard(card.id, { order: index + 1 })
            )
          );
        } else {
          const overBoardCards = getCardsByBoard(overBoardId);
          const newIndex       = overBoardCards.findIndex((c) => c.id === overId);

          setCards((prev) =>
            prev.map((c) =>
              c.id === activeId
                ? { ...c, boardId: overBoardId, order: newIndex + 1 }
                : c
            )
          );

          await apiUpdateCard(activeId, {
            boardId: overBoardId,
            order: newIndex + 1,
          });
        }
      } else if (overBoardData) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? { ...c, boardId: overBoardData.id, order: 1 }
              : c
          )
        );

        await apiUpdateCard(activeId, {
          boardId: overBoardData.id,
          order: 1,
        });
      }
    } else if (activeBoardData && overBoardData) {
      const oldIndex = boards.findIndex((b) => b.id === activeBoardData.id);
      const newIndex = boards.findIndex((b) => b.id === overBoardData.id);

      const newBoards = arrayMove([...boards], oldIndex, newIndex).map((b, i) => ({
        ...b,
        order: i + 1,
      }));

      setBoards(newBoards);

      await Promise.all(
        newBoards.map((b) =>
          apiUpdateBoard(b.id, { title: b.title, order: b.order })
        )
      );
    }

    setActiveCard(null);
  }

  return (
    <div className="flex flex-col gap-8 w-full bg-[#1F1D29] min-h-screen">
      <div className="flex items-center justify-between gap-2 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 bg-[#2B2B39] h-[110px] border-b border-[#2F2F3C] shadow-xl">
        {isEditingProjectTitle ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsEditingProjectTitle(false);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="bg-black border border-gray-600 rounded px-2 py-1 text-white text-2xl font-bold"
              autoFocus
            />
            <button
              type="submit"
              className="text-sm bg-blue-600 px-2 py-1 rounded text-white"
            >
              Save
            </button>
          </form>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white">{projectTitle}</h1>
          </>
        )}

        <div className="rounded-xl p-2 font-bold bg-[#8038F0]">
          <AddBoardButton
            onClick={handleAddBoard}
            showLabel={true}
            className="text-md"
          >
            Add new board
          </AddBoardButton>
        </div>
      </div>

      <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <DragAndDropWrapper
          boards={boards}
          cards={cards}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
          getCardsByBoard={getCardsByBoard}
          handleDragEnd={handleDragEnd}
          handleAddBoard={handleAddBoard}
          deleteBoard={async (id) => {
            await apiDeleteBoard(id);
            setBoards((prev) => prev.filter((b) => b.id !== id));
          }}
          updateBoard={async (id, data) => {
            await apiUpdateBoard(id, data);
            setBoards((prev) =>
              prev.map((b) => (b.id === id ? { ...b, ...data } : b))
            );
          }}
          createCard={async (boardId, card) => {
            await apiCreateCard({ ...card, boardId });
            const updated = await fetchCards();
            setCards(updated);
          }}
          deleteCard={async (id) => {
            await apiDeleteCard(id);
            setCards((prev) => prev.filter((c) => c.id !== id));
          }}
          updateCard={async (id, card) => {
            await apiUpdateCard(id, card);
            const updated = await fetchCards();
            setCards(updated);
          }}
          fetchCards={async () => {
            const updated = await fetchCards();
            setCards(updated);
          }}
          maxCards={maxCardsPerBoard}
        />
      </div>

      <BoardFormModal
        isOpen={isBoardModalOpen}
        onClose={() => {
          setIsBoardModalOpen(false);
          setEditingBoard(null);
        }}
        onSubmit={handleSubmitBoard}
        defaultValues={editingBoard || undefined}
      />
    </div>
  );
}

export default KanbanBoard;
