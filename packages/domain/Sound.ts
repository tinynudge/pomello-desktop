export interface Sound {
  isPlaying(): void;
  play(): Promise<void>;
  pause(): void;
  stop(): void;
}
