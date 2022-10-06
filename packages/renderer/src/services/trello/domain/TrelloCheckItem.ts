export interface TrelloCheckItem {
  id: string;
  idCard: string;
  name: string;
  pos: number;
  state: 'complete' | 'incomplete';
}
