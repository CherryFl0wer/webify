import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { HelperSpotify } from './helpers/spotify';
import { DBConfig } from './config/database';
import * as mongoose from 'mongoose';
import { UserController } from './controllers/user'
import * as cors from 'cors';


const app = express();

app.set('port', process.env.PORT || 3000);
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


app.listen(app.get('port'), () => {
  console.log(('App is running at http://localhost:%d'), app.get('port'));
  console.log('Press CTRL-C to stop\n');
});

module.exports = app;