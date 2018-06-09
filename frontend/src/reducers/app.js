import * as types from '../constants/types.js';

let identity = {
    adding_playlist: false, // action
    is_connected: false, // state
    user_data_spotify: {}, // Spotify metadata
    user_atok_spotify: null, // Spotify metada
    user: null, // user data
    modal: false
}

export default function app(state = identity, action) {
    let napp;
    switch (action.type) {
        case types.ToggleModal:
            napp = Object.assign({}, state, {
                modal: !state.modal
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
            napp.user.song_list = action.data.message;
            return napp;
        default:
            return state;
    }
}

