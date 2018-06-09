import * as types from '../constants/types.js';

let identity = {
    currentaudio: null,
    playing: false,
    strplay: "play",
    urlSong: "",
    volume: 100,
    finish: "0:00",
    metadata: {
        image_cover: '',
        artists: [''],
        added_at: "",
        _id: null,
        name: '',
        type: 'upload',
        duration_ms: 0,
        file_id: ""
    },
    nbplay: 0,
    queue: []
}

export default function player(state = identity, action) {
    let nplayer;
    switch (action.type) {
        case types.AddToQueue:
            state.queue.push(action.id);
            return state;
        case types.PlayerSetup:
            nplayer = Object.assign({}, state, { currentaudio: action.audio });
            return nplayer;
        case types.PlayerPlaying:
            nplayer = Object.assign({}, state);

            if (nplayer.nbplay == 0) { // First time playing
                const id = action.id;
                let data = action.data;
                const url = "http://localhost:3000/song/stream/" + id;

                nplayer.currentaudio.src = url;

                nplayer.metadata = data;

                nplayer.metadata.duration_ms = nplayer.metadata.duration_ms / 1024;
                nplayer.finish = (nplayer.metadata.duration_ms / 60).toString();
                nplayer.finish = nplayer.finish.slice(0, 4).replace(".", ":");

                nplayer.urlSong = url;
            }

            nplayer.nbplay += 1;
            nplayer.strplay = "pause";
            nplayer.currentaudio.play();
            nplayer.playing = !nplayer.currentaudio.paused;
            return nplayer;
        case types.PlayerPausing:
            nplayer = Object.assign({}, state);
            nplayer.strplay = "play";
            nplayer.currentaudio.pause();

            nplayer.playing = !nplayer.currentaudio.paused;
            return nplayer;
        default:
            return state;
    }
}

