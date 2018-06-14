import fetch from 'cross-fetch';
import {
    CreatePlaylist, CreatePlaylistFail, DeletePlaylist, DeletePlaylistFail,
    GetPlaylist, GetPlaylistFail, AddSongInPlaylist, AddSongInPlaylistFail,
    GetPlaylists, GetPlaylistsFail, SwitchPlaylist, RemoveSongInPlaylist,
    RemoveSongInPlaylistFail
} from '../constants/types'


export const createPlaylist = (title) => {

    return dispatch => {
        return fetch('http://localhost:3000/playlist/create', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ title: title })
        })
            .then(response => response.json())
            .then(res => {
                console.log(res)
                dispatch(({ type: CreatePlaylist, data: res }))
            })
            .catch(err => {
                console.log(err)
                dispatch(({ type: CreatePlaylistFail, error: err }))
            });
    }

}

export const getPlaylist = (title) => {
    return dispatch => {
        return fetch('http://localhost:3000/playlist/' + title, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(res => {
                dispatch(({ type: GetPlaylist, data: res }))
            })
            .catch(err => {
                dispatch(({ type: GetPlaylistFail, error: err }))
            });
    }
}
export const getPlaylists = () => {
    return dispatch => {
        return fetch('http://localhost:3000/playlists', {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(res => {
                dispatch(({ type: GetPlaylists, data: res }))
            });
    }
}

export const removePlaylist = (title) => {
    return (dispatch, getState) => {
        return fetch('http://localhost:3000/playlist/' + title, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(res => {
                dispatch(({ type: DeletePlaylist, title: title }))
            })
            .catch(err => {
                dispatch(({ type: DeletePlaylistFail, error: err }))
            });
    }
}

export const addSongInPlaylist = (title, idsong) => {
    return dispatch => {
        return fetch('http://localhost:3000/playlist/' + title + "/add/" + idsong, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(res => {
                dispatch(({ type: AddSongInPlaylist, title: title, id: idsong }))
            })
            .catch(err => {
                dispatch(({ type: AddSongInPlaylistFail, error: err }))
            });
    }
}



export const removeSongInPlaylist = (title, idsong) => {
    return dispatch => {
        return fetch('http://localhost:3000/playlist/' + title + "/remove/" + idsong, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(res => {
                dispatch(({ type: RemoveSongInPlaylist, title: title, id: idsong }))

            })
            .catch(err => {
                dispatch(({ type: RemoveSongInPlaylistFail, error: err }))
            });
    }
}

export const switchPlaylist = (title) => {
    return (dispatch, getState) => new Promise((resolve, reject) => {
        dispatch(({ type: SwitchPlaylist, title: title }));
        let state = getState();

        resolve(state);
    });
}
