import * as types from '../constants/types.js';

let identity = {}

export default function error(state = identity, action) {
    let err = null;
    switch (action.type) {
        case types.DownloadingSpotifySongFail:
            err = Object.assign({}, state);
            return err;

        case types.DeleteSongFail:
            err = Object.assign({}, state);
            return err;

        case types.UserLogoutFail:
            err = Object.assign({}, state);
            return err;

        case types.UserLogginFail:
            err = Object.assign({}, state);
            return err;

        case types.UserRegisterFail:
            err = Object.assign({}, state);
            return err;

        case types.UploadSongErr:
            err = Object.assign({}, state);
            return err;

        case types.AddSongInPlaylistFail:
        case types.GetPlaylistFail:
        case types.GetPlaylistsFail:
        case types.DeletePlaylistFail:
        case types.CreatePlaylistFail:
            err = Object.assign({}, state);
            return err;

        default:
            return state;
    }
}

