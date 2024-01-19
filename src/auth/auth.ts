import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from "../models/User";

passport.use(
    'signup',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            // try {
            //     const user = await UserModel.create({ email, password });
            //
            //     return done(null, user);
            // } catch (error) {
            //     done(error);
            // }
                return done(null, new User(email, password));
        }
    )
);

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            // try {
            //     const user = await UserModel.findOne({ email });
            //
            //     if (!user) {
            //         return done(null, false, { message: 'User not found' });
            //     }
            //
            //     const validate = await user.isValidPassword(password);
            //
            //     if (!validate) {
            //         return done(null, false, { message: 'Wrong Password' });
            //     }
            //
            //     return done(null, user, { message: 'Logged in Successfully' });
            // } catch (error) {
            //     return done(error);
            // }

            return done(null, new User(email, password));
        }
    )
);