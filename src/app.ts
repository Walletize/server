import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import routes from './routes/routes';
import secureRoute from './routes/secure-routes';
require('./auth/auth');

// connect db
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);

// // Handle errors.
// app.use(function(err: any, req: any, res: any, next: any) {
//     res.status(err.status || 500);
//     res.json({ error: err });
// });

app.listen(3000, () => {
    console.log('Server started.')
});
