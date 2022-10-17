import { NoteType } from './NoteType';

export interface Note {
  label: string;
  text: string;
  type: NoteType;
}
