export type Note = {
  _id?: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type NoteInput = {
  userId: string;
  title: string;
  content: string;
  tags?: string[];
};
