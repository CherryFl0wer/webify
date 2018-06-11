import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { JsonResponse } from '../helpers/response';


export module UserMiddleware {

    export function is_allowed(req: Request, res: Response, next: NextFunction) {
        const currentSession = req.session;
        const userExisting = currentSession && currentSession.user;
        const reqFromWorker = req.body != null && req.body.forId != null;

        if (userExisting || reqFromWorker) {
            next();
        } else {
            return res.status(500).json(JsonResponse.error("User not connected", 500));
        }
    }

}