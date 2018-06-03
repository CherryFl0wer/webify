import { Request, Response, Router, NextFunction } from 'express';
import { Song, ISong, ISongModel, SongType } from '../models/Song';
import { User } from '../models/User';
import * as mongoose from 'mongoose';

import { Repository } from './repository';
import { ArrayHelper as AH } from '../helpers/array'
import { JsonResponse } from '../helpers/response';
import { UserMiddleware } from '../middlewares/user';
import { SongWorker } from '../helpers/worker';

import * as GridFS from 'gridfs-stream';
import * as requester from 'request';
import * as fs from 'fs';
import { Db, GridFSBucket } from 'mongodb';

import * as multer from 'multer';

import { Types } from 'mongoose';
import { Readable } from 'stream';

let ytdl = require('youtube-dl');
let mp3duration = require('mp3-duration');

interface IMetadataSpotify {
    artists: any[];
    name: string;
}

export class SongController {

    private repo: Repository<ISongModel>;

    private _gridfs: GridFS.Grid;

    private _upload: multer.Instance;


    constructor(router: Router, grid_instance: GridFS.Grid) {
        this.repo = new Repository<ISongModel>(Song);
        this._gridfs = grid_instance;

        console.log(this._gridfs);

        let storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './musictmp/')
            },
            filename: function (req, file, cb) {
                if (file.mimetype != 'audio/mpeg') {
                    cb(new Error("file is not an mp3 format"), null)
                }

                const file_name = file.originalname.toLowerCase().replace(/\s+/g, '+');
                cb(null, "music_" + file_name)
            }
        })

        this._upload = multer({
            storage: storage
        });

        this.youtubeDownload = this.youtubeDownload.bind(this);
        this.pushToDb = this.pushToDb.bind(this);
        this.getListOfSpotifySongs = this.getListOfSpotifySongs.bind(this);
        this.songUpload = this.songUpload.bind(this);
        this.loadSong = this.loadSong.bind(this);

        router.post("/song/ytdl", UserMiddleware.is_allowed, this.youtubeDownload, this.pushToDb);
        router.post("/song/spotifytracks", UserMiddleware.is_allowed, this.getListOfSpotifySongs);
        router.post("/song/upload", UserMiddleware.is_allowed, this._upload.single('song'), this.songUpload, this.pushToDb);

        router.get("/song/:id", UserMiddleware.is_allowed, this.loadSong);
    }


    songUpload(req: Request, res: Response, next: NextFunction) {
        const song = req.file;
        mp3duration(song.path, (err: any, duration: number) => {
            // There is a formula to calculate but i need bitrate and channels.

            res.locals.info = {
                tags: [], // let's see
                duration: duration * 1000,
                artist: "", // given by user
                cover: "", // given by user
                name: song.originalname // new name given by user
            };
            res.locals.codeVideo = song.path;
            res.locals.origin = SongType.UPLOAD;

            next();
        });
    }

    /**
     * @description : Find the first video of youtube matching keyword then download it
     */
    youtubeDownload(req: Request, res: Response, next: NextFunction) {
        let keywords: string = req.query.q;
        let origin: string = req.query.origin;
        let metadata: IMetadataSpotify = req.body;
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

                res.locals.codeVideo = codeVideo;
                res.locals.origin = originType;
                res.locals.info = {
                    tags: info.tags,
                    duration: total,
                    artist: info.uploader,
                    name: info.title,
                    cover: "https://i.ytimg.com/vi/" + codeVideo + "/maxresdefault.jpg"
                };

                console.log("Downloading -> ", codeVideo, " waiting...");

                ytdl.exec(
                    urlYt,
                    ['-x', '--audio-format', 'mp3', '-o', './musictmp/music_' + codeVideo + '.mp3'],
                    {},
                    (err: any, output: any) => {

                        if (err) {
                            return res.json(JsonResponse.error("Can't download youtube video " + codeVideo, 503));
                        }

                        if (originType == SongType.SPOTIFY) {
                            res.locals.info.artist = metadata.artists.map(e => e.name);
                            res.locals.info.name = metadata.name;
                        }
                        return next();
                    });

            });
        });
    }


    pushToDb(req: Request, res: Response, next: NextFunction) {

        console.log("Done finished downloading ", res.locals.info.name);

        // TODO move

        let writestream = this._gridfs.createWriteStream(
            { filename: res.locals.codeVideo, metadata: res.locals.info }
        );

        const pathMsc = (res.locals.origin == SongType.UPLOAD) ? res.locals.codeVideo : "./musictmp/music_" + res.locals.codeVideo + ".mp3";

        fs.createReadStream(pathMsc).pipe(writestream);
        let t = this;

        fs.unlink(pathMsc, (err: any) => {

            if (err) {
                return res.json(JsonResponse.error(err, 500));
            }


            writestream.on('close', async function (file: any) {
                let artistList = (res.locals.info.artist instanceof Array) ? res.locals.info.artist : [res.locals.info.artist];
                let nameSong = res.locals.info.name;
                let result = await t.repo.create({
                    name: nameSong,
                    image_cover: res.locals.info.cover,
                    artists: artistList,
                    type: res.locals.origin,
                    duration_ms: res.locals.info.duration,
                    file_id: file._id
                });

                User.pushSong(req.session.user._id, result.message._id, (err, updatedUser) => {
                    if (!err) {
                        return res.json(result);
                    }
                    return res.json(JsonResponse.error(err, 500));
                });
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
        requester("https://api.spotify.com/v1/me/tracks?limit=50&offset=0", {
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
                    artists: artistList,
                    name: track.track.name
                });
            });

            return res.json(body)
        });
    }


    // Remove song


    loadSong(req: Request, res: Response) {
        const id = req.params.id as string;


        res.set('content-type', 'audio/mp3');
        res.set('accept-ranges', 'bytes');

        Song.findById(id, (err, song) => {

            //const objid = new Types.ObjectId(song.file_id);
            const objid = song.file_id;

            let streaming = this._gridfs.createReadStream({
                _id: objid
            });

            streaming.on('data', (chunk) => {
                res.write(chunk);
            });

            streaming.on('error', () => {
                res.sendStatus(404);
            });

            streaming.on('end', () => {
                res.end();
            });
        })


    }

}
