import * as types from '../constants/types.js';
import history from '../lib/history';

let identity = {
    adding_playlist: false, // action
    is_connected: false, // state
    user_atok_spotify: null, // Spotify metada
    user: null, // user data
    modalStepOne: false,
    modalStepTwo: false,
    modalAddPlaylist: false,
    currentPlaylist: "library",
    downloadedSpotifySong: false,
    queueSong: [], // library of user
    playlists: []
}

export default function app(state = identity, action) {
    let napp;
    switch (action.type) {

        case types.ToggleModalOne: {
            napp = Object.assign({}, state, {
                modalStepOne: !state.modalStepOne
            });

            return napp;
        }
        case types.ToggleModalTwo: {
            napp = Object.assign({}, state, {
                modalStepTwo: !state.modalStepTwo,
                modalStepOne: false
            });

            return napp;
        }

        case types.AddingPlaylistAction: {
            napp = Object.assign({}, state, {
                adding_playlist: !state.adding_playlist
            });

            return napp;
        }

        case types.SpotifyLogginAction: {
            const res = action.result;
            if (res != undefined) {
                napp = Object.assign({}, state, {
                    is_connected: true,
                    user: res.user,
                    user_atok_spotify: res.user.access_token
                });

                return napp;
            }
            return state;
        }

        case types.GetUserSongList: {
            napp = Object.assign({}, state);
            return napp;
        }

        case types.UserRegister: {
            napp = Object.assign({}, state);
            history.push('/')
            history.go();
            return napp;
        }
        case types.UserLoggin: {
            if (action.data.type == 'success') {
                napp = Object.assign({}, state, {
                    is_connected: true,
                    user: action.data.message
                });
            }
            return napp;
        }
        case types.GetAllSongsOfUser: {
            napp = Object.assign({}, state);
            if (action.data.message) {
                napp.queueSong = action.data.message;
                napp.queueSong.forEach(item => {
                    item.duration_sec = item.duration_ms / 1000;
                })
            }
            return napp;
        }
        case types.SwitchPlaylist: {
            napp = Object.assign({}, state);
            napp.currentPlaylist = action.title;
            return napp;
        }
        case types.UploadSong: {
            napp = Object.assign({}, state);
            action.data.duration_sec = action.data.duration_ms / 1000;
            napp.queueSong.push(action.data);
            napp.user.song_list.push(action.data._id);
            return napp;
        }
        case types.UserLogout: {
            napp = Object.assign({}, state, identity);
            return napp;
        }
        case types.DeleteSong: {
            napp = Object.assign({}, state);
            napp.queueSong.splice(action.index, 1);
            return napp;
        }
        case types.GetUserSession: {
            napp = Object.assign({}, state);
            napp.user = action.data;
            napp.is_connected = true;
            return napp;
        }
        case types.DownloadingSpotifySong: {
            napp = Object.assign({}, state);
            napp.downloadedSpotifySong = true;
            return napp;
        }
        case types.AddSongInPlaylist: {
            napp = Object.assign({}, state);

            const idx = napp.playlists.findIndex(e => e.title == action.title);
            if (idx != -1) {
                napp.playlists[idx].songs.push(action.id);
            }
            return napp;
        }

        case types.RemoveSongInPlaylist: {
            napp = Object.assign({}, state);

            const idx = napp.playlists.findIndex(e => e.title == action.title);

            if (idx != -1) {
                let songidx = napp.playlists[idx].songs.findIndex(e => e == action.id);
                if (songidx != -1)
                    napp.playlists[idx].songs.splice(songidx, 1);
            }
            return napp;
        }

        case types.DeletePlaylist: {
            napp = Object.assign({}, state);
            const idx = napp.playlists.findIndex(e => e.title == action.title);
            if (idx != -1) {
                napp.playlists.splice(idx, 1);
                napp.currentPlaylist = 'library';
            }
            return napp;
        }
        case types.GetPlaylist: {
            napp = Object.assign({}, state);
            return napp;
        }

        case types.GetPlaylists: {
            napp = Object.assign({}, state);
            const data = action.data.message;
            napp.playlists = [];
            data.forEach(item => {
                napp.playlists.push(item)
            });
            return napp;
        }
        case types.CreatePlaylist: {
            napp = Object.assign({}, state);
            napp.playlists.push(action.data.message)
            return napp;
        }
        case types.ToggleModalAddPlaylist: {
            napp = Object.assign({}, state);
            napp.modalAddPlaylist = !napp.modalAddPlaylist;
            return napp;
        }
        default:
            return state;
    }
}

