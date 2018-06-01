import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { JsonResponse } from '../helpers/response';

export module UserMiddleware {

    export function is_allowed(req: Request, res: Response, next: NextFunction): void {
        const currentSession = req.session;

        if (currentSession && currentSession.user && currentSession.user.is_connected) {
            next();
        } else {
            res.json(JsonResponse.error("User not connected", 400));
        }
    }
}