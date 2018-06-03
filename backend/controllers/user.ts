import { Request, Response, Router } from 'express';
import { User, IUser, IUserModel } from '../models/User';
import { Repository } from './repository';
import { Checker } from '../helpers/checker';
import { JsonResponse } from '../helpers/response';
import { UserMiddleware } from '../middlewares/user';

import * as bcrypt from 'bcrypt';

export class UserController {
    private repo: Repository<IUserModel>;
    private model: IUserModel;

    constructor(router: Router) {

        this.model = User;
        this.repo = new Repository<IUserModel>(this.model);

        // Binding
        this.register = this.register.bind(this);
        this.connexion = this.connexion.bind(this);
        this.logout = this.logout.bind(this);

        // Routes
        router.post("/user/register", this.register);
        router.post("/user/connexion", this.connexion);
        router.get("/user/logout", UserMiddleware.is_allowed, this.logout);
    }

    async register(req: Request, res: Response) {
        let body = req.body;

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
            return res.json(JsonResponse.error("No email or password", 400));
        }


        this.model.findByMail(body.email, (err, user) => {
            if (err || user.is_connected) {
                return res.json(JsonResponse.error("Mail not found", 400))
            }

            bcrypt.compare(body.password, user.password, (err2, same) => {
                if (err2 || !same) {
                    return res.json(JsonResponse.error("Incorrect password", 400))
                }

                this.model.findByIdAndUpdate(user._id, { "is_connected": true }, (err, idc) => {
                    if (err) {
                        return res.json(JsonResponse.error("Something went wrong :(", 500));
                    }

                    user.is_connected = true;
                    req.session.user = user;

                    return res.json(JsonResponse.success(user));
                })
            });
        });

    }


    logout(req: Request & { session: any }, res: Response) {
        req.session.destroy();

        res.json(JsonResponse.success("Successfull disconnect"));
    }

}
