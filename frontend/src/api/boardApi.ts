import type { Board } from "../types";
import config from "../config";

const API_BASE_URL = config.API_BASE_URL;

export async function fetchBoards(): Promise<Board[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/boards`, {
      method: "GET",
      credentials: "include",
    });
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Error fetching boards:", error);
    return [];
  }
}

export async function createBoard(data: Partial<Board>): Promise<Board> {
  console.log("Creating board with data:", data);

  try {
    const res = await fetch(`${API_BASE_URL}/boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Failed to create board:", res.status, error);
      throw new Error(`Server responded with ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error creating board:", err);
    throw err;
  }
}

export async function updateBoard(id: string, data: { title: string; order: number; color?: string }): Promise<Board> {
  try {
    const res = await fetch(`${API_BASE_URL}/boards/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data), 
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Server error:", res.status, errorData);
      throw new Error(`Failed to update board: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error updating board:", err);
    throw err;
  }
}

export async function deleteBoard(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/boards/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (err) {
    console.error("Error deleting board:", err);
    throw err;
  }
}