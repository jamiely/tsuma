export {};

interface Audio {
  play(): void;
}

interface GeneratedSound {

}

interface SFXR {
  generate(string): GeneratedSound;
  play(sound: GeneratedSound): void;
  toAudio(definition: any): Audio;
}

declare global {
  interface Window { sfxr: SFXR; }
}
