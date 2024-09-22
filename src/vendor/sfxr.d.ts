export declare const sfxr: SFXR;

interface Audio {
  play(): void;
}

interface GeneratedSound {

}

interface SFXR {
  generate(string): GeneratedSound;
  play(sound: GeneratedSound): void;
  toAudio(definition: object): Audio;
}
