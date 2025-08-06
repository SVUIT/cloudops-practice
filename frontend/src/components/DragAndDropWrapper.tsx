import {
  DndContext,
  closestCorners,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import BoardContainer from "./BoardContainer";
import type { Board, Card } from "../types";
import AddBoardButton from "./AddBoardButton"; 

interface Props {
  boards: Board[];
  cards: Card[];
  activeCard: Card | null;
  setActiveCard: (card: Card | null) => void;
  getCardsByBoard: (boardId: string) => Card[];
  handleDragEnd: (event: DragEndEvent) => void;
  handleAddBoard: () => void;

  deleteBoard: (id: string) => Promise<void>;
  updateBoard: (id: string, data: { title: string; order: number }) => Promise<void>;
  createCard: (boardId: string, card: Partial<Card>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  updateCard: (id: string, card: Partial<Card>) => Promise<void>;
  fetchCards: () => Promise<void>;
  maxCards: number;
}

function DragAndDropWrapper({
  boards,
  cards,
  activeCard,
  setActiveCard,
  getCardsByBoard,
  handleDragEnd,
  handleAddBoard,
  deleteBoard,
  updateBoard,
  createCard,
  deleteCard,
  updateCard,
  fetchCards,
  maxCards,
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragStart={(e: DragStartEvent) => {
        const id = String(e.active.id);
        const found = cards.find((c) => c.id === id);
        if (found) setActiveCard(found);
      }}
      onDragCancel={() => setActiveCard(null)}
    >
      <div className="flex gap-4 p-4 overflow-x-auto">
        <SortableContext
          items={boards.map((b) => String(b.id))}
          strategy={horizontalListSortingStrategy}
        >
          {boards.map((board) => (
            <BoardContainer
              key={board.id}
              board={board}
              cards={getCardsByBoard(board.id)}
              deleteBoard={deleteBoard}
              updateBoard={updateBoard}
              createCard={createCard}
              deleteCard={deleteCard}
              updateCard={updateCard}
              fetchCards={fetchCards}
              maxCards={maxCards}
            />
          ))}
          <AddBoardButton 
            onClick={handleAddBoard} 
            showLabel={false} 
            iconClassName="self-start"
          />
        </SortableContext>
      </div>

      <DragOverlay>
        {activeCard && (
          <TaskCard
            card={activeCard}
            deleteCard={async () => Promise.resolve()}
            onEdit={() => {}}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default DragAndDropWrapper;
