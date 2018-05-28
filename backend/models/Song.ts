import * as mongoose from "mongoose";
import { IUser } from "./User";

export enum SongType {
    SPOTIFY = 'spotify',
    UPLOAD = 'upload',
    LINK = 'link'
}

export interface ISong extends mongoose.Document {
    name: string;
    available_markets: string[];
    image_cover?: string;
    artists: string[];
    album?: string;
    type: SongType;
    duration_ms: number;
    uri?: string;
    user: IUser;
}

export interface ISongModel extends mongoose.Model<ISong> {
    // Personnal methods
}

let schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    available_markets: {
        type: [String],
        default: ["FR", "UK", "DE", "ES", "US"]
    },

    image_cover: {
        type: String
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
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

export let Song = mongoose.model<ISong>("User", schema) as ISongModel;