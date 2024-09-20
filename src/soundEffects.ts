const noop: any = () => {};

export const soundEffects = window.sfxr || {
  toAudio: () => ({play: noop}),
};