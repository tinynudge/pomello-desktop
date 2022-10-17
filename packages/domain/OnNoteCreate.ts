import { Note } from './Note';

export type OnNoteCreate = (taskId: string, note: Note) => void;
