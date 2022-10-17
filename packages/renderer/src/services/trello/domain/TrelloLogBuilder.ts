export interface TrelloLogBuilder {
  addEntry(entry: string): TrelloLogBuilder;
  save(): Promise<void>;
}
