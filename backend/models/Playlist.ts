import * as mongoose from "mongoose";
import { ISong } from "./Song";
import { IUser } from "./User";

export interface IPlaylist extends mongoose.Document {
    title: string;
    songs: ISong[];
    user: IUser;
}


type PlaylistResponse = (err: any, res: IPlaylist) => void;

export interface IPlaylistModel extends mongoose.Model<IPlaylist> {
    // Personnal methods
    findByTitle(title: string, sessionID : string, cb : PlaylistResponse) : void;
    findByTitleAndRemove(title : string, sessionID: string, cb : PlaylistResponse) : void;
}

let schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    songs: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})


schema.statics.findByTitle = function (title: string, sessionID: string, cb: PlaylistResponse) : void {
    return this.findOne({ $and: [{ title: title }, { user: sessionID }] }, cb);
}

schema.statics.findByTitleAndRemove = function (title : string, sessionID: string, cb : PlaylistResponse) : void {
    return this.findOneAndRemove({ $and: [{ title: title }, { user: sessionID }] }, cb);
}

export let Playlist = mongoose.model<IPlaylist>("Playlist", schema) as IPlaylistModel;
