import { Request, Response, Router } from 'express';
import { User, IUser, IUserModel } from '../models/User';
import { Repository } from './repository';
import { Checker } from '../helpers/checker';
import { JsonResponse } from '../helpers/response';
import { UserMiddleware } from '../middlewares/user';

import { Types } from 'mongoose';

import { IPlaylist, IPlaylistModel, Playlist } from '../models/Playlist';

export class PlaylistController {
    private repo: Repository<IPlaylistModel>;
    private model: IPlaylistModel;

    constructor(router: Router) {

        this.model = Playlist;
        this.repo = new Repository<IPlaylistModel>(this.model);

        // Binding
        this.create = this.create.bind(this);
        this.display = this.display.bind(this);
        this.delete = this.delete.bind(this);
        // Routes

        router.post("/playlist/create", UserMiddleware.is_allowed, this.create);
        router.get("/playlist/:title", UserMiddleware.is_allowed, this.display);
        router.delete("/playlist/:title", UserMiddleware.is_allowed, this.delete);
    }


    async create(req: Request, res: Response) {
        const body = req.body;

        if (!Checker.isPlaylistValid(body)) {
            return res.json(JsonResponse.error("Body not valid", 500));
        }

        this.model.findByTitle(body.title, req.session.user._id, async  (err, playlist) => {

            if (err) {
                return res.json(JsonResponse.error(err, 500));
            }
            else if (playlist) {
                return res.json(JsonResponse.error(body.title + " already exist", 500));
            }


            const result = await this.repo.create({
                title: body.title,
                user: new Types.ObjectId(req.session.user._id)
            });

            return res.json(result)
        });

    }

    // Rename Method ???


    display(req: Request, res: Response) {

        const title = req.params.title as string;

        this.model.findByTitle(title, req.session.user._id, (err, playlist) => {

            if (err) {
                return res.json(JsonResponse.error(err, 200));
            }
            else if (!playlist) {
                return res.json(JsonResponse.error(title + " does not exist", 400));
            }

            return res.json(JsonResponse.success(playlist));
        });

    }

    delete(req : Request, res : Response) {
        const title = req.params.title as string;

        this.model.findByTitleAndRemove(title, req.session.user._id, (err, playlist) => {
            
            if (err) {
                return res.json(JsonResponse.error(err, 200));
            }

            return res.json(JsonResponse.success("Deleted"));
        });
    }

}
