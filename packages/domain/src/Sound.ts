export type Sound = {
  isPlaying(): void;
  play(): Promise<void>;
  pause(): void;
  stop(): void;
};
