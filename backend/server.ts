import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as mongoose from 'mongoose';
import * as cors from 'cors';

import { HelperSpotify } from './helpers/spotify';
import { DBConfig } from './config/database';
import { UserController } from './controllers/user';
import { SongController } from './controllers/song';
import { SongWorker } from './helpers/worker';

import * as RedisSession from 'connect-redis';


const app = express();

const Session = require('express-session');

const RedisStore = require('connect-redis')(Session);

app.use(Session({
    store: new RedisStore(),
    secret: 'IOuL85f4a10lNbs',
    resave: false,
    saveUninitialized: true
}));



app.set('port', process.env.PORT || 3000);
app.set('trust proxy', 1);


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))
  .use(cookieParser());


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
  next();
});

mongoose.connect("mongodb://" + DBConfig.dbHost + ":" + DBConfig.dbPort + "/" + DBConfig.dbName);

app.get('/spotify-login', HelperSpotify.spotify_login)
app.get('/spotify-redirect', HelperSpotify.spotify_redirect)

const User = new UserController(app);
const Song = new SongController(app);



// can be clustered to increase perf
app.listen(app.get('port'), () => {
  console.log(('App is running at http://localhost:%d'), app.get('port'));
  console.log('Press CTRL-C to stop\n');

  SongWorker.initWorker();
});

module.exports = app;