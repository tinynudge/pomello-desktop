export type TrelloLogBuilder = {
  addEntry(entry: string): TrelloLogBuilder;
  removeLastEntry(): TrelloLogBuilder;
  save(): Promise<void>;
  updateTimeSpent(time: number): TrelloLogBuilder;
};
