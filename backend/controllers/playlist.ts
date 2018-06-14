import { Request, Response, Router } from 'express';
import { User, IUser, IUserModel } from '../models/User';
import { Repository } from './repository';
import { Checker } from '../helpers/checker';
import { JsonResponse } from '../helpers/response';
import { UserMiddleware } from '../middlewares/user';

import { Types, mongo, Mongoose } from 'mongoose';

import { IPlaylist, IPlaylistModel, Playlist } from '../models/Playlist';
import {  Song, ISong } from '../models/Song';


export class PlaylistController {
    private repo: Repository<IPlaylistModel>;
    private model: IPlaylistModel;

    constructor(router: Router) {

        this.model = Playlist;
        this.repo = new Repository<IPlaylistModel>(this.model);

        // Binding
        this.create = this.create.bind(this);
        this.display = this.display.bind(this);
        this.all = this.all.bind(this);
        this.delete = this.delete.bind(this);
        this.removeSong = this.removeSong.bind(this);
        this.addSong = this.addSong.bind(this);
        // Routes

        router.post("/playlist/create", UserMiddleware.is_allowed, this.create);
        router.get("/playlist/:title", UserMiddleware.is_allowed, this.display);
        router.get("/playlists", UserMiddleware.is_allowed, this.all);
        router.delete("/playlist/:title", UserMiddleware.is_allowed, this.delete);
        router.post("/playlist/:title/add/:idsong", UserMiddleware.is_allowed, this.addSong);

        router.delete("/playlist/:title/remove/:idsong", UserMiddleware.is_allowed, this.removeSong);
    }


    async create(req: Request, res: Response) {
        const body = req.body;

        if (!Checker.isPlaylistValid(body)) {
            return res.json(JsonResponse.error("Body not valid", 500));
        }

        this.model.findByTitle(body.title, req.session.user._id, async (err, playlist) => {

            if (err) {
                return res.status(500).json(JsonResponse.error(err, 500));
            }
            else if (playlist) {
                return res.status(500).json(JsonResponse.error(body.title + " already exist", 500));
            }


            const result = await this.repo.create({
                title: body.title,
                user: new Types.ObjectId(req.session.user._id)
            });

            return res.json(result)
        });

    }


    display(req: Request, res: Response) {

        const title = req.params.title as string;

        this.model.findByTitle(title, req.session.user._id, (err, playlist) => {

            if (err) {
                return res.status(500).json(JsonResponse.error(err, 500));
            }
            else if (!playlist) {
                return res.status(400).json(JsonResponse.error(title + " does not exist", 400));
            }

            return res.json(JsonResponse.success(playlist));
        });

    }


    all(req: Request, res: Response) {


        this.model.find({ user: req.session.user._id }).populate('Song').exec((err, playlists) => {

            if (err) {
                return res.status(500).json(JsonResponse.error(err, 500));
            }
            
            return res.json(JsonResponse.success(playlists));
        });

    }

    delete(req: Request, res: Response) {
        const title = req.params.title as string;

        this.model.findByTitleAndRemove(title, req.session.user._id, (err, playlist) => {
            
            if (err) {
                return res.status(500).json(JsonResponse.error(err, 500));
            }

            return res.json(JsonResponse.success("Deleted"));
        });
    }


    addSong(req: Request, res: Response) {
        const title = req.params.title as string;
        const idsong = req.params.idsong as string;
        this.model.addIntoPlaylist(title, req.session.user._id, idsong, (err, playlist) => {
            if (err || !playlist) {
                return res.status(500).json(JsonResponse.error(err, 500));
            }

            return res.json(JsonResponse.success(playlist));
        })
    }

    removeSong(req: Request, res: Response) {
        const title = req.params.title as string;
        const idsong = req.params.idsong as string;
        this.model.removeIntoPlaylist(title, req.session.user._id, idsong, (err, playlist) => {
            if (err || !playlist) {
                return res.status(500).json(JsonResponse.error(err, 500));
            }

            return res.json(JsonResponse.success("deleted"));
        })
    }


}
