import * as types from '../constants/types.js';

let identity = {
    adding_playlist: false,
    is_connected: false,
    user_data_spotify: {},
    user_atok_spotify: null
}

export default function app(state = identity, action) {
    switch (action.type) {
        case types.AddingPlaylistAction:
            let napp = Object.assign({}, state, {
               adding_playlist: !state.adding_playlist
            });

            return napp;
        case types.SpotifyLogginAction:
            const res = action.result;
            if (res.data !== undefined) {
                // Maybe changed after created user in DB 
                let napp = Object.assign({}, state, {
                    is_connected: true,
                    user_data_spotify: res.data,
                    user_atok_spotify: res.access_token
                });

                return napp;
            }
            return state;
        default:
            return state;
    }
}

