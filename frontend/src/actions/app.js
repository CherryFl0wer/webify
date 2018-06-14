import fetch from 'cross-fetch';

import {
    UserLoggin, SpotifyLogginAction, AddingPlaylistAction, GetAllSongsOfUser,
    ToggleModalOne, ToggleModalTwo, AddToQueue, UploadSong, UserLogginFail,
    UploadSongErr, UserLogout, UserLogoutFail, GetUserSession, DeleteSong,
    DeleteSongFail, UserRegister, UserRegisterFail,DownloadingSpotifySong,
    DownloadingSpotifySongFail, ToggleModalAddPlaylist
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
        return fetch('http://localhost:3000/spotify-redirect?code=' + code + "&state=" + state, {
            credentials: 'include'
        })
            .then(response => response.json())
            .then(res => {
                dispatch(receiveSpotifyLogginAnswer(res.message))
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
            body: JSON.stringify(json)
        })
            .then(response => response.json())
            .then(res => {
                dispatch(({ type: UserRegister, data: res }))
            }).catch(err => {
                dispatch(({ type: UserRegisterFail, error: err }))
            })
    }
}

export const userLogout = () => {
    return dispatch => {
        return fetch('http://localhost:3000/user/logout', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(res => {
                dispatch(({ type: UserLogout }));
            })
            .catch(err => {

                dispatch(({ type: UserLogoutFail, error: err }));
            })
    }
}


export const getUserSession = () => {
    return dispatch => {
        return fetch('http://localhost:3000/user/session', {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(res => {
                if (res.type != "error")
                    dispatch(({ type: GetUserSession, data: res.message }))
            })
            .catch(err => {
                dispatch(({ type: UserLogginFail, error: err }));
            })
    }
}

export const deleteSong = (id, idx) => {
    return dispatch => {
        return fetch('http://localhost:3000/song/remove/' + id.toString(), {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(res => {
                if (res.type != "error")
                    dispatch(({ type: DeleteSong, index: idx }))
            })
            .catch(err => {
                dispatch(({ type: DeleteSongFail, error: err }));
            })
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
                dispatch(({ type: GetAllSongsOfUser, data: res }))
            });
    }
}

export const getUserSongList = () => {
    return dispatch => {
        return fetch('http://localhost:3000/user/spotify_songlist', {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(res => {
                console.log(res);
                 return res.message
            }).then(data => {
                dispatch(getAllSongsOfUser(data));
            });
    }
}


export const uploadSong = (form, data) => {

    const action = (data.ytid) ? "ytdl" : "upload";
    const req = (data.ytid) ? "?q=" + data.ytid + "&origin=link" : "";
    let headers = {
        'Accept': 'application/json'
    }

    if (data.ytid)
        headers["Content-Type"] = "application/json";

    return dispatch => {
        return fetch('http://localhost:3000/song/' + action + req, {
            method: "POST",
            headers: headers,
            credentials: 'include',
            body: (data.ytid) ? JSON.stringify(data) : form
        })
            .then(response => response.json())
            .then(res => {
                dispatch(({ type: UploadSong, data: res.message }));
            })
            .catch(err => {
                dispatch(({ type: UploadSongErr, error: err }))
            })
    }
}

export const dlSpotifySong = (at) => {
    return dispatch => {
        return fetch('http://localhost:3000/song/spotifytracks', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ at: at })
        })
            .then(response => response.json())
            .then(res => {
                dispatch(({ type: DownloadingSpotifySong, data: res.message }));
            })
            .catch(err => {
                dispatch(({ type: DownloadingSpotifySongFail, error: res.message }));
            });
    }
}

// Generic APP

export const toggleModalOne = () => ({ type: ToggleModalOne })

export const toggleModalTwo = () => ({ type: ToggleModalTwo })

export const toggleModalAddPlaylist = () => ({ type: ToggleModalAddPlaylist })