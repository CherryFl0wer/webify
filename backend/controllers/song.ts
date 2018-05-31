import { Request, Response, Router, NextFunction } from 'express';
import { Song, ISong, ISongModel, SongType } from '../models/Song';

import * as mongoose from 'mongoose';

import { Repository } from './repository';
import { ArrayHelper as AH } from '../helpers/array'
import { JsonResponse } from '../helpers/response';

import { SongWorker } from '../helpers/worker';

import * as GridFS from 'gridfs-stream';
import * as requester from 'request';
import * as fs from 'fs';
import { Db } from 'mongodb';

let ytdl = require('youtube-dl');


export class SongController {

    private repo: Repository<ISongModel>;

    private _gridfs: GridFS.Grid;


    constructor(router: Router) {
        this.repo = new Repository<ISongModel>(Song);

        this.youtubeDownload = this.youtubeDownload.bind(this);
        this.pushToDb = this.pushToDb.bind(this);
        this.getListOfSpotifySongs = this.getListOfSpotifySongs.bind(this);

        router.get("/song/ytdl", this.youtubeDownload, this.pushToDb);
        router.post("/song/spotifytracks", this.getListOfSpotifySongs);
    }


    /**
     * @description : Find the first video of youtube matching keyword then download it
     */
    youtubeDownload(req: Request, res: Response, next: NextFunction) {
        let keywords = req.query.q;
        let origin: string = req.query.origin;
        const originType: SongType = (origin.toLowerCase() == SongType.SPOTIFY) ? SongType.SPOTIFY : SongType.LINK;

        requester({
            url: "https://m.youtube.com/results?client=mv-google&hl=fr&gl=FR&q=" + keywords + "+audio&submit=Rechercher",
            method: 'GET', gzip: true
        }, (err, resp, body) => {
            let firstVideo = unescape(body).match(/watch\?v=(.*?)+"/)[0];
            let codeVideo = firstVideo.match(/watch\?v=(.*?)\"/)[1];
            let urlYt = 'http://www.youtube.com/watch?v=' + codeVideo;

            ytdl.getInfo(urlYt, [], (err: any, info: any) => {
                if (err) throw err;

                let durstr: string = info.duration;
                let durarr: number[] = []
                durstr.split(':').forEach(e => {
                    durarr.push(parseInt(e));
                });

                const total = AH.arrTimeToMs(durarr);

                res.locals.info = {
                    tags: info.tags,
                    duration: total,
                    artist: info.uploader,
                    cover: "https://i.ytimg.com/vi/" + codeVideo + "/maxresdefault.jpg"
                };

                console.log("Downloading -> ", codeVideo, " ->");

                ytdl.exec(
                    urlYt,
                    ['-x', '--audio-format', 'mp3', '-o', './musictmp/' + codeVideo + '.mp3'],
                    {},
                    (err: any, output: any) => {

                        if (err) {
                            return res.json(JsonResponse.error("Can't download youtube video " + codeVideo, 503));
                        }

                        res.locals.codeVideo = codeVideo;
                        res.locals.origin = originType;
                        return next();
                    });

            });
        });
    }


    pushToDb(req: Request, res: Response, next: NextFunction) {

        this._gridfs = GridFS(mongoose.connection.db, mongoose.mongo); // can't move it -- TODO
        let writestream = this._gridfs.createWriteStream(
            { filename: res.locals.codeVideo }
        );
        const pathMsc = "./musictmp/" + res.locals.codeVideo + ".mp3";
        fs.createReadStream(pathMsc).pipe(writestream);

        let t = this;

        fs.unlink(pathMsc, (err: any) => {
            if (err) {
                return res.json(JsonResponse.error2(err, 500));
            }

            writestream.on('close', async function (file: any) {

                let result = await t.repo.create({
                    name: file.filename,
                    image_cover: res.locals.info.cover,
                    artists: [res.locals.info.artist],
                    type: res.locals.origin,
                    duration_ms: res.locals.info.duration,
                    file_id: file._id
                });

                // Add to the current user song_list -- TODO
                return res.json(result);
            });
        })
    }


    /**
     * @description : Get list of songs from a spotify user
     *                Put every song in a queue list to dl them
     *                
     * @param req 
     * @param res 
     * @param next 
     */
    getListOfSpotifySongs(req: Request, res: Response, next: NextFunction) {
        let at = req.body.at;
        let totalOfTrack = 0;
        requester("https://api.spotify.com/v1/me/tracks?limit=5&offset=0", {
            json: true,
            headers: {
                'Authorization': 'Bearer ' + at
            }
        }, (err: any, response: any, body: any) => {

            if (err || body.error) {
                return res.json(JsonResponse.error("Access token expired", 403));
            }
            totalOfTrack = body.total;
            const elems = body.items;

            elems.forEach((track: any) => {
                const artistList = track.track.artists;

                let keyword = track.track.name;
                if (artistList.length > 0) {
                    keyword += " " + artistList[0].name;
                }
                keyword = keyword.replace(/\s+/g, '+')
                console.log("Enqueuing spotify:", track.track.id, " - ", keyword);
                SongWorker.enQueue({ 
                    videoId: track.track.id,
                    keyword: keyword,
                    artists: artistList 
                });
            });

            return res.json(body)
        });
    }


}
