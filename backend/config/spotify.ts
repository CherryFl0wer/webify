import { Request, Response } from 'express';
import * as querystring from 'querystring'

export module SpotifyConfig {
    
    const apiSpotify = "https://api.spotify.com"
    const clientID = "1ba80100e92d4d49870b7e4fc4931720"
    const clientSecret = "3da3164990b4482dbdeb3bc941a07466"
    const redirectURI = "http://localhost:3000/redirect" 

    export let spotifyStateKey = "spotify_auth_state"



    /**
     * Generates a random string containing numbers and letters for the state
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    export function giveState (length : number) : string 
    {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        
        return text
    }

    /**
     * Send request to connect at the spotify api
     * @param  {Response} res Response object
     * @param  {string} scope keywords allowing access to certain data
     * @param  {string} state state of the current connexion
     * @return {void}
     */
    export function connexion (res : Response, scope : string, state : string) : void 
    {
        res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id: clientID,
          scope: scope,
          redirect_uri: redirectURI,
          state: state
        }));
    }

     /**
     * Return requesting.CoreOptions object
     * @param  {string} code code form
     * @return {any}   
     */
    export function authentificationOptions (code : string) : any 
    {
        return {
            url: 'https://accounts.spotify.com/api/token',
            form: {
              code: code,
              redirect_uri: redirectURI,
              grant_type: 'authorization_code'
            },
            headers: {
              'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64'))
            },
            json: true
        };
    }
}