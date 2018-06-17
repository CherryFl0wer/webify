import { Request, Response, Router, NextFunction } from 'express';
import { Song, ISong, ISongModel, SongType } from '../models/Song';
import { User } from '../models/User';
import * as mongoose from 'mongoose';

import { Repository } from './repository';
import { ArrayHelper as AH } from '../helpers/array'
import { JsonResponse } from '../helpers/response';
import { UserMiddleware } from '../middlewares/user';
import { SongWorker } from '../helpers/worker';

import * as requester from 'request';
import * as fs from 'fs';
import { Db, GridFSBucket } from 'mongodb';

import * as multer from 'multer';

import { Types } from 'mongoose';
import { Readable } from 'stream';
import { Playlist } from '../models/Playlist';

let ytdl = require('youtube-dl');
let mp3duration = require('mp3-duration');

interface IMetadataSpotify {
    artists: any[];
    name: string;
}

export class SongController {

    private repo: Repository<ISongModel>;

    private _gridfs: GridFSBucket;

    private _upload: multer.Instance;

    constructor(router: Router, grid_instance: GridFSBucket) {
        this.repo = new Repository<ISongModel>(Song);
        this._gridfs = grid_instance;

        let storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './musictmp/')
            },
            filename: function (req, file, cb) {
                if (file.mimetype == 'audio/mpeg' || file.mimetype == 'audio/mp3') {
                    const file_name = file.originalname.toLowerCase().replace(/\s+/g, '+');
                    cb(null, "music_" + file_name);
                }
                else {
                    cb(new Error("file is not an mp3 format"), null);
                }
            }
        })

        this._upload = multer({
            storage: storage,
            limits: {
                fileSize: 1024 * 1024 * 20
            },
        });

        this.youtubeDownload = this.youtubeDownload.bind(this);
        this.pushToDb = this.pushToDb.bind(this);
        this.getListOfSpotifySongs = this.getListOfSpotifySongs.bind(this);
        this.songUpload = this.songUpload.bind(this);
        this.loadSong = this.loadSong.bind(this);
        this.streamSong = this.streamSong.bind(this);
        this.loadSongs = this.loadSongs.bind(this);
        this.deletesong = this.deletesong.bind(this);

        router.post("/song/ytdl", UserMiddleware.is_allowed, this.youtubeDownload, this.pushToDb);
        router.post("/song/spotifytracks", UserMiddleware.is_allowed, this.getListOfSpotifySongs);
        router.post("/song/upload", UserMiddleware.is_allowed, this.songUpload, this.pushToDb);
        router.get("/song/stream/:id", UserMiddleware.is_allowed, this.streamSong);
        router.get('/song/:id', UserMiddleware.is_allowed, this.loadSong);
        router.post('/song/list', UserMiddleware.is_allowed, this.loadSongs);
        router.post('/song/remove/:id', UserMiddleware.is_allowed, this.deletesong);
    }

    /**
       * @description : Manual upload of song
       * @param req 
       * @param res 
       * @param next 
       */
    songUpload(req: Request, res: Response, next: NextFunction) {
        this._upload.single('song')(req, res, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json(JsonResponse.error(err, 500));
            }

            console.log(req.file);
            const song = req.file;
            const data = req.body;
            if (!song)
                return res.status(500).json(JsonResponse.error("Undefined file", 500));

            mp3duration(song.path, (err: any, duration: number) => {
                // There is a formula to calculate but i need bitrate and channels.

                res.locals.info = {
                    duration: duration * 1000,
                    artist: data.artists.split(','),
                    cover: data.cover,
                    name: data.name
                };
                res.locals.codeVideo = song.path;
                res.locals.origin = SongType.UPLOAD;

                next();
            });
        });
    }

    /**
     * @description : Find the first video of youtube matching keyword then download it
     * @param req 
     * @param res 
     * @param next 
     */
    youtubeDownload(req: Request, res: Response, next: NextFunction) {
        const keywords: string = req.query.q;
        const origin: string = req.query.origin;

        const originType: SongType = (origin.toLowerCase() == SongType.SPOTIFY) ? SongType.SPOTIFY : SongType.LINK;

        let metadata: any = req.body;

        console.log("Downloading youtube video");

        if (originType == SongType.SPOTIFY && metadata.forId == null)
            return res.status(500).json(JsonResponse.error("Can't download spotify song", 500));

        requester({
            url: "https://m.youtube.com/results?client=mv-google&hl=fr&gl=FR&q=" + keywords + "+audio&submit=Rechercher",
            method: 'GET', gzip: true
        }, (err, resp, body) => {

            let codeVideo = "";

            if (originType == SongType.SPOTIFY)  {
                let firstVideo = unescape(body).match(/watch\?v=(.*?)+"/)[0];
                codeVideo = firstVideo.match(/watch\?v=(.*?)\"/)[1];
            }
            else {
                codeVideo = metadata.ytid;
            }

            let urlYt = 'http://www.youtube.com/watch?v=' + codeVideo;

            ytdl.getInfo(urlYt, [], (err: any, info: any) => {
                if (err) throw err;

                // convert string duration to int ms
                let durstr: string = info.duration;
                let durarr: number[] = []
                durstr.split(':').forEach(e => {
                    durarr.push(parseInt(e));
                });

                const total = AH.arrTimeToMs(durarr);

                // Data to pass to push db
                res.locals.codeVideo = codeVideo;
                res.locals.origin = originType;
                res.locals.info = {
                    duration: total,
                    artist: (metadata.artists) ? metadata.artists.split(',') : info.uploader,
                    name: (metadata.name) ? metadata.name : info.title,
                    cover: (metadata.cover) ? metadata.cover : "https://i.ytimg.com/vi/" + codeVideo + "/maxresdefault.jpg"
                };

                if (originType == SongType.SPOTIFY)
                    res.locals.forId = metadata.forId;


                console.log("Downloading -> ", codeVideo, " waiting...");

                ytdl.exec(
                    urlYt,
                    ['-x', '--audio-format', 'mp3', '-o', './musictmp/music_' + codeVideo + '.mp3'],
                    {},
                    (err: any, output: any) => {

                        if (err) {
                            return res.status(500).json(JsonResponse.error("Can't download youtube video " + codeVideo, 500));
                        }

                        return next();
                    });

            });
        });
    }


    /**
     * @description Get data of musique and put them into the db
     * @param req 
     * @param res 
     * @param next 
     */
    pushToDb(req: Request, res: Response, next: NextFunction) {

        console.log("Done finished downloading ", res.locals.info.name);

        let writestream = this._gridfs.openUploadStream(res.locals.codeVideo, {
            metadata: res.locals.info
        })

        const pathMsc = (res.locals.origin == SongType.UPLOAD) ? res.locals.codeVideo : "./musictmp/music_" + res.locals.codeVideo + ".mp3";

        fs.createReadStream(pathMsc).pipe(writestream);
        let t = this;

        fs.unlink(pathMsc, (err: any) => {

            if (err) {
                return res.status(500).json(JsonResponse.error(err, 500));
            }

            writestream.once('finish', async function () {
                let artistList = (res.locals.info.artist instanceof Array) ? res.locals.info.artist : [res.locals.info.artist];

                let result = await t.repo.create({
                    name: res.locals.info.name,
                    image_cover: res.locals.info.cover,
                    artists: artistList,
                    type: res.locals.origin,
                    duration_ms: res.locals.info.duration,
                    file_id: writestream.id
                });

                let id_user = (res.locals.origin != SongType.SPOTIFY) ? req.session.user._id : res.locals.forId;
                User.pushSong(id_user, result.message._id, (err, updatedUser) => {
                    if (!err) {
                        return res.json(result);
                    }
                    return res.status(500).json(JsonResponse.error(err, 500));
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
        let offset = 0;
        let total = 0;
        requester("https://api.spotify.com/v1/me/tracks?limit=50&offset=" + offset, {
            json: true,
            withCredentials: true,
            headers: {
                'Authorization': 'Bearer ' + at
            }
        }, (err: any, response: any, body: any) => {

            if (err || body.error) {
                return res.status(403).json(JsonResponse.error("Access token expired", 403));
            }

            offset += 50;
            total = body.total;
            let elems = body.items;
            elems.forEach((track: any) => {
                // Extract information
                const artistList = track.track.artists;

                let keyword = track.track.name;
                if (artistList.length > 0) {
                    keyword += " " + artistList[0].name;
                }

                keyword = keyword.replace(/\s+/g, '+');

                const flat_artist = artistList
                    .map((e: any) => e.name)
                    .reduce((acc: any, elm: any) => acc + elm + ",", "");

                console.log("Enqueuing spotify:", track.track.id, " - ", keyword);

                SongWorker.enQueue({
                    videoId: track.track.id,
                    artists: flat_artist.substring(0, flat_artist.length - 1),
                    name: track.track.name,
                    keyword: keyword,
                    forId: req.session.user._id
                });
            });


            return res.json(JsonResponse.success("Downloading your last 50 songs"))
        });
    }


    /**
     * @description load a mp3 song from database files
     * @param req 
     * @param res 
     */


    loadSong(req: Request, res: Response) {

        const id = req.params.id as string;
        Song.findById(id, (err, song) => {
            return res.json(JsonResponse.success(song));
        });
    }

    /**
     * @description Load a list of songs 
     * @param req 
     * @param res 
     */

    loadSongs(req: Request, res: Response) {
        const list = req.body;

        Song.listSongByObjId(list.data, (err, songs) => {
            return res.json(JsonResponse.success(songs));
        });
    }


    /**
     * @description Stream a song 
     * @param req 
     * @param res 
     */


    streamSong(req: Request, res: Response) {
        const id = req.params.id as string;

        res.set('content-type', 'audio/mp3');
        res.set('accept-ranges', 'bytes');

        let t = this;

        try {
            var trackID = new mongoose.mongo.ObjectId(id);
        } catch (err) {
            return res.status(400).json(JsonResponse.error("Incorrect ID", 400));
        }

        let streaming = t._gridfs.openDownloadStream(trackID);

        streaming.on('data', (chunk) => {
            res.write(chunk);
        });

        streaming.on('error', () => {
            res.sendStatus(404);
        });

        streaming.on('end', () => {
            res.end();
        });
    }


    /**
     * @description Delete a song 
     * @param req 
     * @param res 
     */

    deletesong(req: Request, res: Response) {
        let id = req.params.id;
        let t = this;
        Song.findByIdAndRemove(id, (err, song) => {

            if (err || !song) {
                return res.status(500).json(JsonResponse.error(err, 500));
            }

            User.update({ _id: mongoose.Types.ObjectId(req.session.user._id) },
                { $pull: { song_list: mongoose.Types.ObjectId(song._id) } },
                (err, raw) => {
                    if (err) {

                        console.log(err);
                        return res.status(500).json(JsonResponse.error(err, 500));
                    }

                    t._gridfs.delete(song.file_id, (err) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json(JsonResponse.error(err, 500));
                        }

                        return res.json(JsonResponse.success("Song deleted"));
                    });
                })
        });
    }



}
