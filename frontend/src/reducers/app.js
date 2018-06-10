import * as types from '../constants/types.js';

let identity = {
    adding_playlist: false, // action
    is_connected: false, // state
    user_data_spotify: {}, // Spotify metadata
    user_atok_spotify: null, // Spotify metada
    user: null, // user data
    modalStepOne: false,
    modalStepTwo: false,
    error: null,
    queueSong: []
}

export default function app(state = identity, action) {
    let napp;
    switch (action.type) {
        case types.ToggleModalOne:
            napp = Object.assign({}, state, {
                modalStepOne: !state.modalStepOne
            });

            return napp;
        case types.ToggleModalTwo:
            napp = Object.assign({}, state, {
                modalStepTwo: !state.modalStepTwo,
                modalStepOne: false
            });

            return napp;
        case types.AddingPlaylistAction:
            napp = Object.assign({}, state, {
                adding_playlist: !state.adding_playlist
            });

            return napp;
        case types.SpotifyLogginAction:
            const res = action.result;
            if (res.data !== undefined) {
                // Maybe changed after created user in DB 
                napp = Object.assign({}, state, {
                    is_connected: true,
                    user_data_spotify: res.data,
                    user_atok_spotify: res.access_token
                });

                return napp;
            }
            return state;
        case types.UserLoggin:
            if (action.data.type == 'success') {
                napp = Object.assign({}, state, {
                    is_connected: true,
                    user: action.data.message
                });
            }
            return napp;
        case types.GetAllSongsOfUser:
            napp = Object.assign({}, state);
            napp.queueSong = action.data.message;
            napp.queueSong.forEach(item => {
                item.duration_sec = item.duration_ms / 1024;
            })
            return napp;
        case types.UploadSong:
            napp = Object.assign({}, state);
            
            action.data.duration_sec = action.data.duration_ms / 1024;
            napp.queueSong.push(action.data);
            return napp;
        case types.UserLogginFail: 
            napp = Object.assign({}, state);
            napp.error = action.error;
            return state;
        case types.UploadSongErr: 
            return state;
        default:
            return state;
    }
}

