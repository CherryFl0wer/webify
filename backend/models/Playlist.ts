import { prop, Typegoose, ModelType, InstanceType, Ref, arrayProp} from 'typegoose';
import { User } from './User'
import { Song } from './Song'
/*
*  @additional : 
*/
export class Playlist extends Typegoose {

    @prop()
    title: string;

    @arrayProp({itemsRef: Song })
    songs : Ref<Song>[];
    
    @prop({ required : true })
    owner : Ref<User>;
}