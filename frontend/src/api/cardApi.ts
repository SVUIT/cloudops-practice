import type { Card } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchCardsByBoard(boardId: string): Promise<Card[]> {
  const response = await fetch(`${API_BASE_URL}/cards/board/${boardId}`);
  if (!response.ok) throw new Error("Failed to fetch cards");
  return response.json();
}

export async function fetchCards(): Promise<Card[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/cards`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Fetch cards failed:", response.status);
      throw new Error("Failed to fetch cards");
    }

    const responseData = await response.json();
    const data = responseData.data; 

    if (!Array.isArray(data)) {
      console.error("Expected card array, got:", responseData);
      throw new Error("Invalid response format for cards");
    }

    return data;
  } catch (error) {
    console.error("Error fetching cards:", error);
    return [];
  }
}

export async function createCard(data: Partial<Card>): Promise<Card> {
  const response = await fetch(`${API_BASE_URL}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create card");
  return response.json();
}

export async function updateCard(id: string, data: Partial<Card>): Promise<Card> {
  const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update card");
  return response.json();
}

export async function deleteCard(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete card");
}