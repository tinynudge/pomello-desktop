export interface TrelloCheckItem {
  id: string;
  name: string;
  pos: number;
  state: 'complete' | 'incomplete';
}
