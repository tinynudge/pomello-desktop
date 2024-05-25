import { NoteType } from './NoteType';

export type Note = {
  label: string;
  text: string;
  type: NoteType;
};
