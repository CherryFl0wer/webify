import { prop, Typegoose, ModelType, InstanceType, Ref, arrayProp } from 'typegoose';
import { User } from './User'
/*
*  @additional : 
*/

export enum SongType {
    SPOTIFY = 'spotify',
    UPLOAD  = 'upload',
    LINK    = 'link'
}

export class Song extends Typegoose {

    @prop({ required: true })
    name  : string;

    @arrayProp({ items: String })
    available_markets? : string[];

    @prop()
    image_cover? : string;

    @arrayProp({ items: String, required: true })
    artist : string[];

    @prop()
    album? : string;

    @prop({ enum: SongType, required: true, default: SongType.LINK }) 
    type : SongType;

    @prop({ required: true, min: 0 })
    duration_ms : number;

    @prop()
    uri? : string; 

    @prop({ ref: User, required: true, default: null })
    user? : Ref<User>;

}
