import * as types from '../constants/types.js';

let identity = {
    currentaudio: null,
    playing: false,
    urlSong: "",
    finish: "0:00",
    prevIdx: 0,
    curIdxInQueue: 0,
    metadata: { // Check if you can delete it
        image_cover: '',
        artists: ['Unknown'],
        added_at: "",
        _id: null,
        name: '',
        type: 'upload',
        duration_ms: 0,
        duration_sec: 0,
        file_id: ""
    }
}

export default function player(state = identity, action) {
    let nplayer;
    switch (action.type) {
        case types.PlayerSetup:
            nplayer = Object.assign({}, state, { currentaudio: action.audio });
            return nplayer;
        case types.PlayerPlaying:
            nplayer = Object.assign({}, state);

            if (nplayer.urlSong == "" || action.idx != nplayer.curIdxInQueue) { // First time playing or play different song

                const idx = action.idx;
                const currentQueue = action.queue;
                const currentSong = currentQueue[idx];

                const id = currentSong.file_id;
                const data = currentSong;


                const url = "http://localhost:3000/song/stream/" + id; 

                nplayer.currentaudio.src = url;
                nplayer.prevIdx = nplayer.curIdxInQueue;
                nplayer.curIdxInQueue = idx;

                nplayer.metadata = data;

                nplayer.metadata.duration_sec = nplayer.metadata.duration_ms / 1000;
                let min = parseInt(nplayer.metadata.duration_sec / 60);
                let sec = parseInt(nplayer.metadata.duration_sec % 60);
                let nsec = sec.toString()
                if (sec < 10)
                    nsec = "0" + nsec;

                nplayer.finish = min.toString() + " : " + nsec;

                nplayer.urlSong = url;
            }

            nplayer.currentaudio.play();
            nplayer.playing = !nplayer.currentaudio.paused;
            return nplayer;
        case types.PlayerPausing:
            nplayer = Object.assign({}, state);
            nplayer.currentaudio.pause();

            nplayer.playing = !nplayer.currentaudio.paused;
            return nplayer;
        default:
            return state;
    }
}

