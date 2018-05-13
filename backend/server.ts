import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { HelperSpotify }  from './helpers/spotify';
import { DBConfig } from './config/database';
import * as mongoose from 'mongoose';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

mongoose.connect("mongodb://" + DBConfig.dbHost + ":" + DBConfig.dbPort + "/" + DBConfig.dbName);


app.get('/spotify-login', HelperSpotify.spotify_login)
app.get('/spotify-redirect', HelperSpotify.spotify_redirect)


app.listen(app.get('port'), () => {
  console.log(('App is running at http://localhost:%d'), app.get('port'));
  console.log('Press CTRL-C to stop\n');
});

module.exports = app;