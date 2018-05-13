import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';
/*
*  @additional : 
*/
export class User extends Typegoose {

    @prop({ required : true, unique: true })
    email:          string;

    @prop()
    password?: string;

    @prop({ required : true, default: "FR" })
    country:        string;

    @prop({ required : true, unique: true })
    spotify_id?:     string;

    @prop({ required : true, default: false })
    is_premium?:     boolean;

    @prop({ required : true })
    spotify_link?:   string;

    @prop({ required : true })
    spotify_api?:    string;

    @prop()
    access_token?: string;

    @prop({ default: false })
    is_connected: boolean;


    

}
