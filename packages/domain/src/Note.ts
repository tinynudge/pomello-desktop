import { NoteType } from '@tinynudge/pomello-service';

export type Note = {
  label: string;
  text: string;
  type: NoteType;
};
