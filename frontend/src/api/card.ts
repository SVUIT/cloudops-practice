const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface Card {
  id: string;
  boardId: string;
  content: string;
  description?: string;
  order: number;
  subjectName: string;
  semester: string;
  typeSubject: string;
  dueDate?: string;
  isArchived?: boolean;
  labels?: string[];
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export const getCards = async (): Promise<Card[]> => {
  const res = await fetch(`${BASE_URL}/cards`);
  if (!res.ok) throw new Error("Failed to fetch cards");
  return res.json();
};

export const createCard = async (card: Partial<Card>): Promise<Card> => {
  const res = await fetch(`${BASE_URL}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(card),
  });
  if (!res.ok) throw new Error("Failed to create card");
  return res.json();
};

export const updateCard = async (id: string, card: Partial<Card>): Promise<Card> => {
  const res = await fetch(`${BASE_URL}/cards/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(card),
  });
  if (!res.ok) throw new Error("Failed to update card");
  return res.json();
};

export const deleteCard = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/cards/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete card");
};
