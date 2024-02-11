import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import routes from './routes/routes';
import secureRoute from './routes/secure-routes';
import 'dotenv/config'
require('./auth/auth');

const app = express();

app.use(express.json())

app.use('/', routes);

app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);

app.listen(process.env.PORT, () => {
    console.log('Server started at ' + process.env.PORT)
});
