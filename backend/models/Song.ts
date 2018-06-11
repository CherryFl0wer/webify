import * as mongoose from "mongoose";

export enum SongType {
    SPOTIFY = 'spotify',
    UPLOAD = 'upload',
    LINK = 'link'
}

export interface ISong extends mongoose.Document {
    name: string;
    image_cover?: string;
    artists: string[];
    album?: string;
    type: SongType;
    duration_ms: number;
    uri?: string;
    file_id: any;
}

export interface ISongModel extends mongoose.Model<ISong> {
    // Personnal methods
    listSongByObjId(user_list: string[], cb: (err: any, songs: ISong[]) => void): void;
}



let schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    image_cover: {
        type: String,
        default: "default.png"
    },

    artists: {
        type: [String],
        required: true
    },

    type: {
        type: String,
        enum: [SongType.LINK, SongType.SPOTIFY, SongType.UPLOAD],
        required: true
    },

    duration_ms: {
        type: Number,
        required: true,
        min: 0
    },

    uri: {
        type: String,
        required: false
    },

    file_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    added_at : {
        type: Date,
        required: true,
        default: Date.now()
    }
})

schema.statics.listSongByObjId = function (user_list: string[], cb: (err: any, songs: ISong[]) => void) {
    return this.find({ _id: { $in: user_list } }, cb);
}
export let Song = mongoose.model<ISong>("Song", schema) as ISongModel;