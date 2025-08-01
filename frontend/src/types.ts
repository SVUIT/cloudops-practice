export type Id = string;

// types.ts

export interface Board {
  id: string;
  title: string;
  order: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

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
  isArchived: boolean;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
