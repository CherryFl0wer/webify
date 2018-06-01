import * as mongoose from "mongoose";
import { ISong } from "./Song";


export interface ISpotifyUser extends mongoose.Document {
    country: string;
    spotify_id?: string;
    is_premium?: boolean;
    spotify_link?: string;
    spotify_api?: string;
}

export interface IUser extends mongoose.Document {
    email: string;
    password?: string;
    is_connected: boolean;
    spotify_infos?: ISpotifyUser
    song_list: ISong[],
    access_token?: string
}

type UserResponse = (err: any, res: IUser) => void;

export interface IUserModel extends mongoose.Model<IUser> {
    // Personnal methods
    findByMail(mail: string, cb: UserResponse): void;
    connexion(id: string, at: string, cb: UserResponse): void;
    pushSong(id_user: string, id_song: string, cb: UserResponse): void;
}



const spotifySchema = new mongoose.Schema({
    country: {
        type: String,
        default: "FR",
        required: true,
        index: true,
        sparse: true
    },

    spotify_id: {
        type: String,
        required: true,
        unique: true,
        index: true,
        sparse: true
    },

    spotify_link: {
        type: String,
        required: true
    },

    spotify_api: {
        type: String,
        default: ""
    },

    is_premium: {
        type: Boolean,
        required: true,
        default: false
    }
}, { _id: false })


let schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    password: {
        type: String
    },

    spotify_infos: spotifySchema,

    song_list: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },

    is_connected: {
        type: Boolean,
        required: true,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    access_token: {
        type: String
    }

})

schema.statics.findByMail = function (mail: string, cb: UserResponse) {
    return this.findOne({ "email": mail }, cb);
}

schema.statics.connexion = function (id: string, at: string, cb: UserResponse) {
    return this.findByIdAndUpdate({ _id: id }, { is_connected: true, access_token: at }, { new: true }, cb);
}

schema.statics.pushSong = function (id_user: string, id_song: string, cb: UserResponse) {
    return this.findByIdAndUpdate({ _id: id_user }, { $push: { song_list: id_song } }, {}, cb);
}

export let User = mongoose.model<IUser>("User", schema) as IUserModel;