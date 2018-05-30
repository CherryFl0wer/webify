import { Request, Response, Router, NextFunction } from 'express';
import { Song, ISong, ISongModel, SongType } from '../models/Song';

import * as mongoose from 'mongoose';

import { Repository } from './repository';
import { JsonResponse } from '../helpers/response';

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

        router.get("/song/ytdl", this.youtubeDownload, this.pushToDb);
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


            ytdl.exec(
                urlYt,
                ['-x', '--audio-format', 'mp3', '-o', './musictmp/' + codeVideo + '.mp3'],
                {},
                function exec(err: any, output: any) {
                    console.log(output);
                    console.log("---------");
                    if (err) {
                        return res.json(JsonResponse.error("Can't download youtube video " + codeVideo, 503));
                    }

                    res.locals.data = codeVideo;
                    res.locals.origin = originType;
                    return next();
                });


        });
    }


    pushToDb(req: Request, res: Response, next: NextFunction) {

        this._gridfs = GridFS(mongoose.connection.db, mongoose.mongo);
        var writestream = this._gridfs.createWriteStream(
            { filename: res.locals.data }
        );
        const pathMsc = "./musictmp/" + res.locals.data + ".mp3";
        fs.createReadStream(pathMsc).pipe(writestream);

        let t = this;

        fs.unlink(pathMsc, (err: any) => {
            writestream.on('close', function (file: any) {
                console.log(file);
                t.repo.create({
                    name: file.filename,
                    artists: ["None"],
                    type: res.locals.origin,
                    duration_ms: 0,
                    file_id: file._id
                });
                res.json(JsonResponse.success(file));
            });
        })
    }
}
