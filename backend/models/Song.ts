import * as mongoose from "mongoose";
import { IUser } from "./User";

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
}

let schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    image_cover: {
        type: String,
        default:"default.png"
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
        required:false
    },

    file_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

export let Song = mongoose.model<ISong>("Song", schema) as ISongModel;