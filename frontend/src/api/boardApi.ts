import type { Board } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchBoards(): Promise<Board[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/boards`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      console.error("Fetch boards failed:", response.status);
      throw new Error("Failed to fetch boards");
    }
    const result = await response.json(); 
    if (typeof result !== 'object' || result === null || !Array.isArray(result.data)) {
      console.error("Expected object with data array but got:", result);
      throw new Error("Invalid response format");
    }
    const data = result.data;
    return data;
  } catch (error) {
    console.error("Error fetching boards:", error);
    return [];
  }
}

export async function createBoard(data: Partial<Board>): Promise<Board> {
  const response = await fetch(`${API_BASE_URL}/boards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create board");
  return response.json();
}

export async function updateBoard(id: string, data: Partial<Board>): Promise<Board> {
  const response = await fetch(`${API_BASE_URL}/boards/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update board");
  return response.json();
}

export async function deleteBoard(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/boards/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete board");
}