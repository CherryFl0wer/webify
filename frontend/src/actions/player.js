import fetch from 'cross-fetch';

import { PlayerPlaying, PlayerPausing, PlayerSetup } from '../constants/types';

export const playMusic = (idx, q) => ({ type: PlayerPlaying, idx:idx, queue: q });
export const pauseMusic = () => ({ type: PlayerPausing });
export const setupAudio = (audio) => ({ type: PlayerSetup, audio: audio });

