import fetch from 'cross-fetch';

import {
    UserLoggin, SpotifyLogginAction, AddingPlaylistAction, GetAllSongsOfUser, ToggleModal
} from '../constants/types'

export const displayAddingPlaylist = () => ({ type: AddingPlaylistAction });
export const receiveSpotifyLogginAnswer = (json) => ({ type: SpotifyLogginAction, result: json });
export const spotifyLoggin = () => {
    return dispatch => {
        return fetch('http://localhost:3000/spotify-login')
            .then(response => response.json())
            .then(res => {
                window.open("https://accounts.spotify.com/authorize?" + res, '_self');
            });
    }
};

export const spotifyConfirmLogAction = (code, state) => {
    return dispatch => {
        return fetch('http://localhost:3000/spotify-redirect?code=' + code + "&state=" + state)
            .then(response => response.json())
            .then(res => {
                dispatch(receiveSpotifyLogginAnswer(res))
            });
    }
};


export const userLoggin = (json) => {
    return dispatch => {
        return fetch('http://localhost:3000/user/connexion', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
            .then(response => response.json())
            .then(res => {
                dispatch(({ type: UserLoggin, data: res }))
            });
    }
}

export const userReg = (json) => {
    return dispatch => {
        return fetch('http://localhost:3000/user/register', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
            .then(response => response.json())
            .then(res => {
                dispatch(({ type: UserRegister, data: res }))
            });
    }
}

export const getAllSongsOfUser = (listsong) => {
    return dispatch => {
        return fetch('http://localhost:3000/song/list', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: listsong })
        })
            .then(response => response.json())
            .then(res => {
                dispatch(({ type: GetAllSongsOfUser, data: res }))
            });
    }
}

export const toggleModal = () => ({ type: ToggleModal })