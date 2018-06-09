import fetch from 'cross-fetch';

import { PlayerPlaying, PlayerPausing, PlayerSetup, AddToQueue } from '../constants/types';

export const playMusic = (id, data) => ({ type: PlayerPlaying, id: id, data: data });
export const pauseMusic = () => ({ type: PlayerPausing });
export const setupAudio = (audio) => ({ type: PlayerSetup, audio: audio });
export const addToQueue = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => { 
            dispatch({ type : AddToQueue, id: id }) 
        })
        .then(() => {
            dispatch(playMusic());
        });
    }
}
