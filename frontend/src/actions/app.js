import fetch from 'cross-fetch';

import {
    UserLoggin, SpotifyLogginAction, AddingPlaylistAction, GetAllSongsOfUser,
    ToggleModalOne, ToggleModalTwo, AddToQueue, UploadSong, UserLogginFail,
    UploadSongErr
} from '../constants/types'


export const displayAddingPlaylist = () => ({ type: AddingPlaylistAction });

// Connexion and register 


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
            credentials: 'include',
            body: JSON.stringify(json)
        })
            .then(response => response.json())
            .then(res => {
                dispatch(({ type: UserLoggin, data: res }))
            }).catch(err => {
                dispatch(({ type: UserLogginFail, error: err }))
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
            credentials: 'include',
            body: JSON.stringify(json)
        })
            .then(response => response.json())
            .then(res => {
                dispatch(({ type: UserRegister, data: res }))
            });
    }
}

// User song list 

export const getAllSongsOfUser = (listsong) => {
    return dispatch => {
        return fetch('http://localhost:3000/song/list', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ data: listsong })
        })
            .then(response => response.json())
            .then(res => {
                if (res.code == 400) 
                {
                    // error
                }
                dispatch(({ type: GetAllSongsOfUser, data: res }))
            });
    }
}

export const addToQueue = (id) => {
   
}

export const uploadSong = (form) => {
    const action = (form.ytid) ? "ytdl" : "upload";
    const req = (form.ytid) ? "?q=" + form.ytid + "&origin=link" : "";
    return dispatch => {
        return fetch('http://localhost:3000/song/' + action + req, {
            method:"POST",
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: form
        })
        .then(response => response.json())
        .then(res => {
            dispatch(({ type: UploadSong, data: res.message }));
        }).catch(err => {
            dispatch(({ type: UploadSongErr, error: err}))
        })
    }
}

// Generic APP

export const toggleModalOne = () => ({ type: ToggleModalOne })

export const toggleModalTwo = () => ({ type: ToggleModalTwo })

