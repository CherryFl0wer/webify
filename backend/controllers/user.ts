import { Request, Response, Router } from 'express';
import { User, IUser, IUserModel } from '../models/User';
import { Song } from '../models/Song';
import { Repository } from './repository';
import { Checker } from '../helpers/checker';
import { JsonResponse } from '../helpers/response';
import { UserMiddleware } from '../middlewares/user';

import * as bcrypt from 'bcrypt';

export class UserController {
    private repo: Repository<IUserModel>;

    constructor(router: Router) {

        this.repo = new Repository<IUserModel>(User);

        // Binding
        this.register = this.register.bind(this);
        this.connexion = this.connexion.bind(this);
        this.logout = this.logout.bind(this);
        this.getCurrentSession = this.getCurrentSession.bind(this);
        // Routes
        router.post("/user/register", this.register);
        router.post("/user/connexion", this.connexion);
        router.post("/user/logout", UserMiddleware.is_allowed, this.logout);
        router.get("/user/session", UserMiddleware.is_allowed, this.getCurrentSession);
    }

    async register(req: Request, res: Response) {
        let body = JSON.parse(req.body);

        if (Checker.isUserValid(body)) {
            if (body.password != undefined) {
                let hash = bcrypt.hashSync(body.password, 10); // TODO Async
                body.password = hash;
                const user = await this.repo.create(body);

                return res.json(user);

            } else {
                const user = await this.repo.create(body);
                return res.json(user);
            }
        }

        return res.json(JsonResponse.error("User not valid", 400));
    }


    connexion(req: Request, res: Response) {
        let body = req.body;
        if (body.email == undefined || body.password == undefined) {
            return res.status(500).json(JsonResponse.error("No email or password", 400));
        }

        User.findByMail(body.email, (err, user) => {

            if (err) {
                return res.status(400).json(JsonResponse.error("Mail not found", 400))
            }
            else if (user.is_connected) {
                return res.status(500).json(JsonResponse.error("Already connected", 500))
            }


            bcrypt.compare(body.password, user.password, (err2, same) => {
                if (err2 || !same) {
                    return res.status(400).json(JsonResponse.error("Incorrect password", 400))
                }

                User.findByIdAndUpdate(user._id, { "is_connected": true }, (err, idc) => {
                    if (err) {
                        return res.status(500).json(JsonResponse.error("Something went wrong :(", 500));
                    }

                    user.is_connected = true;
                    req.session.user = user;

                    return res.json(JsonResponse.success(user));
                })
            });
        });

    }

    getCurrentSession(req: Request, res : Response) {
        if (req.session.user) {
            return res.json(JsonResponse.success(req.session.user));
        }
        return res.status(500);
    }

    logout(req: Request & { session: any }, res: Response) {

        User.findByIdAndUpdate(req.session.user._id, { is_connected: false }, (err, result) => {
            if (err) {
                return res.status(500).json(JsonResponse.error(err, 500));
            }

            req.session.destroy();

            return res.json(JsonResponse.success("Successfull disconnect"));
        });
    }


}
