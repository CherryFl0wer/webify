import * as mongoose from "mongoose";
import { ISong } from "./Song";
import { IUser } from "./User";

export interface IPlaylist extends mongoose.Document {
    title: string;
    songs: ISong[];
    user: IUser;
}

export interface IPlaylistModel extends mongoose.Model<IPlaylist> {
    // Personnal methods
}

let schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    songs: {
        type: [mongoose.Types.ObjectId],
        default: []
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

export let Playlist = mongoose.model<IPlaylist>("Playlist", schema) as IPlaylistModel;
