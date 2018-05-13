import { Request, Response } from 'express';
import { SpotifyConfig } from '../config/spotify';

import * as querystring from 'querystring';
import * as requesting from 'request';

export module HelperSpotify
{

  export function spotify_login(req: Request, res: Response) 
  {
    let state = SpotifyConfig.giveState(16);
    res.cookie(SpotifyConfig.spotifyStateKey, state);
    
    let scope = "user-read-private user-read-email";

    SpotifyConfig.connexion(res, scope, state);
  }



  export function spotify_redirect(req : Request, res: Response) 
  {
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[SpotifyConfig.spotifyStateKey] : null;
  
    if (state === null || state !== storedState) 
    {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } 
    else 
    {
      res.clearCookie(SpotifyConfig.spotifyStateKey);
      let authOptions = SpotifyConfig.authentificationOptions(code);
  
      requesting.post(authOptions, function(error : any, response : any, body : any) 
      {
        if (!error && response.statusCode === 200) 
        {
  
          var access_token = body.access_token,
              refresh_token = body.refresh_token;
  
          var options = 
          {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
  
          // use the access token to access the Spotify Web API
          requesting.get(options, function(error, response, body) {
            return res.json({
              "data": body
            })
          });
  
        } 
        else 
        {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
  }

}