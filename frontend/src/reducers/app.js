import * as types from '../constants/types.js';

let identity = {
    menu_visible: false
}

export default function app(state = identity, action) {
    switch (action.type) {
        case types.ToggleMenuAction:
            let napp = Object.assign({ }, state, {menu_visible: !state.menu_visible});
            return napp;
        default:
            return state;
    }
}

