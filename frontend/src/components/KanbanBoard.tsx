//KanbanBoard.tsx

import { useEffect, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import type { Board, Card } from "../types";
import BoardContainer from "./BoardContainer";
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

function KanbanBoard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);

  // Load boards + cards on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const boardsData = await fetchBoards();
        setBoards(boardsData);
        const cardsData = await fetchCards();
        setCards(cardsData);
      } catch (error) {
        console.error("Load data error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Create board
  async function createNewBoard() {
  try {
    const maxOrder = boards.length > 0 ? Math.max(...boards.map(b => b.order)) + 1 : 1;

    const newBoard = await apiCreateBoard({
      title: "New Board",
      order: maxOrder,
    });

    setBoards((prev) => [...prev, newBoard]);
  } catch (error) {
    console.error("Create board error:", error);
    alert("Failed to create board");
  }
}

  // Delete board + cards of this board
  async function deleteBoard(id: string) {
    try {
      await apiDeleteBoard(id);
      setBoards((prev) => prev.filter((b) => b.id !== id));
      setCards((prev) => prev.filter((c) => c.boardId !== id));
    } catch (error) {
      console.error("Delete board error:", error);
      alert("Failed to delete board");
    }
  }

  // Update board title
  async function updateBoard(id: string, title: string) {
    try {
      const prevBoard = boards.find((b) => b.id === id);
      if (!prevBoard) throw new Error("Board not found");

      const updatedBoard = await apiUpdateBoard(id, {
        title,
        order: prevBoard.order, 
      });

      setBoards((prev) => prev.map((b) => (b.id === id ? updatedBoard : b)));
    } catch (error) {
      console.error("Update board error:", error);
      alert("Failed to update board");
    }
  }

  // Create card for board
  async function createCard(boardId: string, card: Partial<Card>) {
    try {
      const newCard = await apiCreateCard({ ...card, boardId });
      console.log("Card created:", newCard);
      setCards((prev) => [...prev, newCard]);
      return newCard;
    } catch (error) {
      console.error("Create card error:", error);
      alert("Failed to create card");
    }
  }

  // Delete card
  async function deleteCard(id: string) {
    try {
      await apiDeleteCard(id);
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Delete card error:", error);
      alert("Failed to delete card");
    }
  }

  // Update card
  async function updateCard(id: string, card: Partial<Card>) {
    try {
      const updatedCard = await apiUpdateCard(id, card);
      setCards((prev) => prev.map((c) => (c.id === id ? updatedCard : c)));
    } catch (error) {
      console.error("Update card error:", error);
      alert("Failed to update card");
    }
  }

  if (loading) {
    return (
      <div className="w-full px-10 py-6 bg-[#18181b] min-h-screen text-white flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full px-10 py-6 bg-[#18181b] min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
          Projects
          <button
            onClick={createNewBoard}
            className="ml-2 p-1 rounded-full hover:bg-gray-200"
            aria-label="Add new board"
          >
            <PlusIcon />
          </button>
        </h1>
      </div>
      <div className="flex gap-4 overflow-x-auto">
        {boards.map((board, index) => (
          <BoardContainer
            key={`${board.id}-${index}`}
            board={board}
            deleteBoard={deleteBoard}
            updateBoard={updateBoard}
            createCard={createCard}
            deleteCard={deleteCard}
            updateCard={updateCard}
            cards={cards.filter((card) => card.boardId === board.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;
