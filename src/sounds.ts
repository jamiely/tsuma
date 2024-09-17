import { soundEffects } from "./soundEffects";
import { EventManager, GameEventType } from "./types";

export const createSoundManager = (events: EventManager) => {
  const audio: Record<GameEventType, ReturnType<typeof soundEffects.toAudio>> = {
    'launchedBall': audioLaunchedBall,
    'matchedBalls': audioMatchedBalls,
    'gameOver': audioGameOver,
    'ballCollision': audioBallsCollision,
  };

  for(const [eventType, clip] of Object.entries(audio)) {
    events.addEventListener(eventType as GameEventType, () => {
      clip.play();
    })
  }
}

const audioMatchedBalls = soundEffects.toAudio({
  "oldParams": true,
  "wave_type": 0,
  "p_env_attack": 0,
  "p_env_sustain": 0.278748274533751,
  "p_env_punch": 0,
  "p_env_decay": 0.18355917631072796,
  "p_base_freq": 0.3903503648305406,
  "p_freq_limit": 0,
  "p_freq_ramp": 0.21725440970444643,
  "p_freq_dramp": 0,
  "p_vib_strength": 0,
  "p_vib_speed": 0,
  "p_arp_mod": 0,
  "p_arp_speed": 0,
  "p_duty": 0.37202624121271305,
  "p_duty_ramp": 0,
  "p_repeat_speed": 0,
  "p_pha_offset": 0,
  "p_pha_ramp": 0,
  "p_lpf_freq": 0.6663849219868506,
  "p_lpf_ramp": 0,
  "p_lpf_resonance": 0,
  "p_hpf_freq": 0.01900429749807817,
  "p_hpf_ramp": 0,
  "sound_vol": 0.25,
  "sample_rate": 44100,
  "sample_size": 8
})

const audioGameOver = soundEffects.toAudio({
  "oldParams": true,
  "wave_type": 0,
  "p_env_attack": 0.46590302961720154,
  "p_env_sustain": 0.6263278182408667,
  "p_env_punch": 0.9380146419984826,
  "p_env_decay": 0.9029739868261406,
  "p_base_freq": 0.13615778746815113,
  "p_freq_limit": 0,
  "p_freq_ramp": 0,
  "p_freq_dramp": 0,
  "p_vib_strength": 0,
  "p_vib_speed": 0,
  "p_arp_mod": 0,
  "p_arp_speed": 0.8026291921773032,
  "p_duty": 0.48664459270781746,
  "p_duty_ramp": 0.019865581587259706,
  "p_repeat_speed": 0,
  "p_pha_offset": 0,
  "p_pha_ramp": 0,
  "p_lpf_freq": 1,
  "p_lpf_ramp": -0.3714411480865214,
  "p_lpf_resonance": 0.15663158737374483,
  "p_hpf_freq": 0,
  "p_hpf_ramp": 0,
  "sound_vol": 0.25,
  "sample_rate": 44100,
  "sample_size": 8
})

const audioBallsCollision = soundEffects.toAudio({
  "oldParams": true,
  "wave_type": 3,
  "p_env_attack": 0,
  "p_env_sustain": 0.002599699906979103,
  "p_env_punch": 0,
  "p_env_decay": 0.2659575912288942,
  "p_base_freq": 0.6136787329034015,
  "p_freq_limit": 0,
  "p_freq_ramp": -0.6483389940771214,
  "p_freq_dramp": 0,
  "p_vib_strength": 0,
  "p_vib_speed": 0,
  "p_arp_mod": 0,
  "p_arp_speed": 0,
  "p_duty": 0,
  "p_duty_ramp": 0,
  "p_repeat_speed": 0,
  "p_pha_offset": 0,
  "p_pha_ramp": 0,
  "p_lpf_freq": 1,
  "p_lpf_ramp": 0,
  "p_lpf_resonance": 0,
  "p_hpf_freq": 0,
  "p_hpf_ramp": 0,
  "sound_vol": 0.25,
  "sample_rate": 44100,
  "sample_size": 8
});


const audioLaunchedBall = soundEffects.toAudio({
  "oldParams": true,
  "wave_type": 1,
  "p_env_attack": 0,
  "p_env_sustain": 0.031468126640771525,
  "p_env_punch": 0,
  "p_env_decay": 0.17962021205847806,
  "p_base_freq": 0.4591786306218479,
  "p_freq_limit": 0,
  "p_freq_ramp": -0.6411081281888386,
  "p_freq_dramp": 0,
  "p_vib_strength": 0,
  "p_vib_speed": 0,
  "p_arp_mod": 0,
  "p_arp_speed": 0,
  "p_duty": 1,
  "p_duty_ramp": 0,
  "p_repeat_speed": 0,
  "p_pha_offset": 0,
  "p_pha_ramp": 0,
  "p_lpf_freq": 1,
  "p_lpf_ramp": 0,
  "p_lpf_resonance": 0,
  "p_hpf_freq": 0,
  "p_hpf_ramp": 0,
  "sound_vol": 0.25,
  "sample_rate": 44100,
  "sample_size": 8
});