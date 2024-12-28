export class SoundEffect {
  private audio: HTMLAudioElement | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  init() {
    if (typeof window !== 'undefined' && !this.audio) {
      this.audio = new Audio(this.url);
    }
  }

  play() {
    if (!this.audio) {
      this.init();
    }
    if (this.audio) {
      this.audio.currentTime = 0;
      this.audio.play().catch(e => console.log('Error playing sound:', e));
    }
  }
}

export const sounds = {
  correct: new SoundEffect('/sounds/correct.mp3'),
  wrong: new SoundEffect('/sounds/wrong.mp3'),
  tick: new SoundEffect('/sounds/tick.mp3'),
  complete: new SoundEffect('/sounds/complete.mp3'),
}; 