export type Id = string | number;

export interface Board {
  id: Id;
  title: string;
}

export interface Task {
  id: Id;
  boardId: Id;
  content: string;
}


