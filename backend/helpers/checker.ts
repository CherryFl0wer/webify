import { IUser } from '../models/User'
import { IPlaylist } from '../models/Playlist'
import { ISong } from '../models/Song'

export module Checker {
    export function isUserValid(obj: any): boolean {
        let tmp = obj as IUser;
        return tmp.email != undefined && (tmp.spotify_infos != undefined 
                                          || tmp.password != undefined);
    }

    export function isPlaylistValid(obj: any): boolean {
        let tmp = obj as IPlaylist;
        return tmp.title != undefined &&
            tmp.songs != undefined &&
            tmp.user != undefined;
    }


    export function isSongValid(obj: any): boolean {
        let tmp = obj as ISong;
        return tmp.name != undefined &&
            tmp.available_markets != undefined &&
            tmp.artists != undefined &&
            tmp.type != undefined &&
            tmp.duration_ms != undefined &&
            tmp.user != undefined;
    }
}