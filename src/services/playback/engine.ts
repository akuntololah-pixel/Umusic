let timer: ReturnType<typeof setInterval> | null = null;
let getPlaying: () => { isPlaying: boolean; hasSong: boolean } = () => ({ isPlaying: false, hasSong: false });
let onTick: (deltaMs: number) => void = () => {};
const TICK_MS = 500;

export function bindEngine(
  stateGetter: () => { isPlaying: boolean; hasSong: boolean },
  tickHandler: (deltaMs: number) => void
): void {
  getPlaying = stateGetter;
  onTick = tickHandler;
}

export function syncEngine(isPlaying: boolean, hasSong: boolean): void {
  const shouldRun = isPlaying && hasSong;
  if (shouldRun && timer === null) {
    timer = setInterval(() => {
      if (getPlaying().isPlaying) onTick(TICK_MS);
    }, TICK_MS);
  } else if (!shouldRun && timer !== null) {
    clearInterval(timer);
    timer = null;
  }
}

export function stopEngine(): void {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
}
