import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { JsonResponse } from '../helpers/response';


export module UserMiddleware {

    export function is_allowed(req: Request, res: Response, next: NextFunction) {
        const currentSession = req.session;
        console.log(currentSession);
        if (currentSession && currentSession.user) {
            next();
        } else {
            return res.status(500).json(JsonResponse.error("User not connected", 500));
        }
    }

}