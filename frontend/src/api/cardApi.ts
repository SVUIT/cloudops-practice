import type { Card } from "../types";
import config from "../config";

const API_BASE_URL = config.API_BASE_URL;

export async function fetchCards(): Promise<Card[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/cards`, {
      method: "GET",
      credentials: "include",
    });
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Error fetching cards:", error);
    return [];
  }
}

export async function createCard(data: Partial<Card>): Promise<Card> {
  console.log("Creating card with data:", data);

  const cleanData = {
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(cleanData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server error:", res.status, errorText);
      throw new Error(`Failed to create card: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error creating card:", err);
    throw err;
  }
}

export async function updateCard(id: string, data: Partial<Card>): Promise<Card> {
  console.log("Updating card with id:", id, "and data:", data);

  const cleanData: any = {
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
  };

  if (data.boardId) {
    cleanData.board = { connect: { id: data.boardId } };
    delete cleanData.boardId;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/cards/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(cleanData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server error:", res.status, errorText);
      throw new Error(`Failed to update card: ${res.status}`);
    }

    const updatedCard = await res.json();
    console.log("✅ Updated card successfully:", updatedCard);
    return updatedCard;
  } catch (err) {
    console.error("Error updating card:", err);
    throw err;
  }
}


export async function deleteCard(id: string): Promise<void> {
  console.log("Deleting card with id:", id); // ✅ log id

  try {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
      method: "DELETE",
    });

    console.log("Response status:", response.status); // ✅ log HTTP status

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Delete failed:", errorText);
      throw new Error(`Failed to delete card: ${response.status}`);
    }

    console.log("Card deleted successfully."); // ✅ log success
  } catch (err) {
    console.error("Error deleting card:", err);
    throw err;
  }
}
