import { Request, Response } from 'express';
import { SpotifyConfig } from '../config/spotify';

import * as querystring from 'querystring';
import * as requesting from 'request';
import { Repository } from '../controllers/repository';
import { IUserModel, User, IUser } from '../models/User';
import { JsonResponse } from './response';

export module HelperSpotify {

  export function spotify_login(req: Request, res: Response) {
    let state = SpotifyConfig.giveState(16);
    res.cookie(SpotifyConfig.spotifyStateKey, state, { maxAge: 900000, httpOnly: true }); // -- TODO

    let scope = "user-read-private user-read-email user-library-read";

    const result = SpotifyConfig.connexion(scope, state);
    return res.json(result);
  }


  export function spotify_redirect(req: Request, res: Response) {
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[SpotifyConfig.spotifyStateKey] : null;
    const repo = new Repository<IUserModel>(User);

    // State checking is not managed because cookie are not on the same domain localhost:3000 and
    // localhost:8080 therefore cookie does not exist on the request coming from the client 

    if (state === null) // || state !== storedState  
    {
      return res.json({ error: "State undefined or different" })
    }
    else {
      res.clearCookie(SpotifyConfig.spotifyStateKey);
      let authOptions = SpotifyConfig.authentificationOptions(code);

      requesting.post(authOptions, function (error: any, response: any, body: any) {
        if (!error && response.statusCode === 200) {

          var access_token = body.access_token,
            refresh_token = body.refresh_token;

          var options =
            {
              url: 'https://api.spotify.com/v1/me',
              headers: { 'Authorization': 'Bearer ' + access_token },
              json: true
            };

          // use the access token to access the Spotify Web API
          requesting.get(options, function (error, response, body) {

            User.findByMail(body.email, async (err: any, usr: IUser) => {

              if (err) {
                return res.json(JsonResponse.error(err, 500));
              }

              if (usr) {
                User.connexion(usr._id, access_token, (err: any, u: IUser) => {
                  req.session.user = u;
                  return res.json(JsonResponse.success({ user: u }));
                });
              } else {
                let result = await repo.create({
                  email: body.email,
                  is_connected: true,
                  access_token: access_token,
                  spotify_infos: {
                    country: body.country,
                    spotify_id: body.id,
                    is_premium: body.product == 'premium',
                    spotify_link: body.href,
                    spotify_api: body.href
                  }
                });

                if (result.type == "error")
                  return res.status(500).json(JsonResponse.error("Can't create spotify user", 500));

                req.session.user = result.message;
                req.session.save(err => {
                  if (!err)
                    return res.json(result)
                  
                  return res.status(500).json(JsonResponse.error("Can't save session", 500));
                });
              }
            });
          });

        }
        else {
          return res.json({ error: "Unvalidate token" })
        }
      });
    }
  }

}