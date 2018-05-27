import fetch from 'cross-fetch';

import { SpotifyLogginAction, AddingPlaylistAction } from '../constants/types'

export const displayAddingPlaylist = () => ({type: AddingPlaylistAction });
export const receiveSpotifyLogginAnswer = (json) => ({ type: SpotifyLogginAction, result: json });
export const spotifyLoggin = () => {
    return dispatch => {
        return fetch('http://localhost:3000/spotify-login')
        .then(response => response.json())
        .then(res => {
            window.open("https://accounts.spotify.com/authorize?" + res, '_self');
        })
    }
};

export const spotifyConfirmLogAction = (code, state) => {
    return dispatch => {
        return fetch('http://localhost:3000/spotify-redirect?code='+ code + "&state=" + state)
        .then(response => response.json())
        .then(res => {
            dispatch(receiveSpotifyLogginAnswer(res))
        })
    }
};