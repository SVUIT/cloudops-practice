const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface Board {
  id: string;
  title: string;
  order: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getBoards = async (): Promise<Board[]> => {
  const res = await fetch(`${BASE_URL}/boards`);
  if (!res.ok) throw new Error("Failed to fetch boards");
  return res.json();
};

export const createBoard = async (board: Partial<Board>): Promise<Board> => {
  const res = await fetch(`${BASE_URL}/boards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(board),
  });
  if (!res.ok) throw new Error("Failed to create board");
  return res.json();
};

export const updateBoard = async (id: string, board: Partial<Board>): Promise<Board> => {
  const res = await fetch(`${BASE_URL}/boards/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(board),
  });
  if (!res.ok) throw new Error("Failed to update board");
  return res.json();
};

export const deleteBoard = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/boards/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete board");
};
