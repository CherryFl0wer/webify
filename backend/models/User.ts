import * as mongoose from "mongoose";


export interface ISpotifyUser extends mongoose.Document {
    country : string;
    spotify_id? : string;
    is_premium? : boolean;
    spotify_link? : string;
    spotify_api? : string;
    access_token?: string;
}


let spotifySchema = new mongoose.Schema({
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
        index:true,
        sparse: true
    },

    spotify_link: {
        type: String,
        required: true
    },

    spotify_api: {
        type:String,
        default: ""
    },

    is_premium: {
        type: Boolean,
        required : true,
        default: false
    },

    access_token : {
        type: String,
        default: "empty"
    }
}, { _id : false })

export interface IUser extends mongoose.Document {
    email : string;
    password? : string;
    is_connected: boolean;
    spotify_infos?: ISpotifyUser
}

export interface IUserModel extends mongoose.Model<IUser> {
    // Personnal methods
    findByMail(mail : string, cb : (err: any, res : IUser) => void) : void;
}


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

    is_connected: {
        type:Boolean,
        required: true,
        default: false
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }

})

schema.statics.findByMail = function (mail : string, cb : (err: any, res : IUser) => void) {
    return this.findOne({ "email" : mail }, cb);
}


export let User = mongoose.model<IUser>("User", schema) as IUserModel;