import { useEffect, useState, useMemo } from "react";
import PlusIcon from "../icons/PlusIcon";
import type { Board, Card } from "../types";
import BoardContainer from "./BoardContainer";
import { fetchBoards } from "../api/boardApi";
import { fetchCards } from "../api/cardApi";

function KanbanBoard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    fetchBoards().then(setBoards);
  }, []);

  useEffect(() => {
    if (boards.length > 0) {
      fetchCards().then(setCards);
    }
  }, [boards]);

const boardsId = useMemo(() => {
  return Array.isArray(boards) ? boards.map((b) => b.id) : [];
}, [boards]);

  function createNewBoard() {
    // Implement API call to create board
  }

  function deleteBoard(id: string) {
    setBoards(boards.filter((b) => b.id !== id));
    setCards(cards.filter((c) => c.boardId !== id));
  }

  function updateBoard(id: string, title: string) {
    setBoards(boards.map((b) => b.id === id ? { ...b, title } : b));
  }

  function createCard(boardId: string, card: Partial<Card>) {
    // Implement API call to create card
  }

  function deleteCard(id: string) {
    setCards(cards.filter((c) => c.id !== id));
  }

  function updateCard(id: string, card: Partial<Card>) {
    setCards(cards.map((c) => c.id === id ? { ...c, ...card } : c));
  }

  return (
    <div className="w-full px-10 py-6 bg-[#18181b] min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Projects
          <button
            onClick={createNewBoard}
            className="ml-2 p-1 rounded-full hover:bg-gray-200"
          >
            <PlusIcon />
          </button>
        </h1>
      </div>
      <div className="flex gap-4">
        {boards.map((board) => (
          <BoardContainer
            key={board.id}
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