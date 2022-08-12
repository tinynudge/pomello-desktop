import { NoteType } from './NoteType';

export type AddNoteHandler = (type: NoteType, note: string) => void;
