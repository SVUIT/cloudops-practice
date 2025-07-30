export type Id = string;

export interface Board {
  id: Id;
  title: string;
  order: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Card {
  id: Id;
  boardId: Id;
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