import * as mongoose from "mongoose";
import { Song, ISong } from "./Song";
import { IUser } from "./User";

export interface IPlaylist extends mongoose.Document {
    title: string;
    songs: ISong[];
    user: IUser;
}


type PlaylistResponse = (err: any, res: IPlaylist) => void;

export interface IPlaylistModel extends mongoose.Model<IPlaylist> {
    // Personnal methods
    findByTitle(title: string, sessionID: string, cb: PlaylistResponse): void;
    findByTitleAndRemove(title: string, sessionID: string, cb: PlaylistResponse): void;
    addIntoPlaylist(title: string, sessionID: string, idsong: string, cb: PlaylistResponse): void;
}

let schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})


schema.statics.findByTitle = function (title: string, sessionID: string, cb: PlaylistResponse): void {
    return this.findOne({ $and: [{ title: title }, { user: sessionID }] }, cb);
}

schema.statics.findByTitleAndRemove = function (title: string, sessionID: string, cb: PlaylistResponse): void {
    return this.findOneAndRemove({ $and: [{ title: title }, { user: sessionID }] }, cb);
}

schema.statics.addIntoPlaylist = function (title: string, sessionID: string, idsong: string, cb: PlaylistResponse): void {
    return this.findOneAndUpdate({ $and: [{ title: title }, { user: sessionID }] }, { $push: { songs: idsong } }, { returnNewDocument: true }, cb);
}


export let Playlist = mongoose.model<IPlaylist>("Playlist", schema) as IPlaylistModel;
