import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from "../models/User";
import bcrypt from "bcrypt";
import 'dotenv/config'

passport.use(
    'signup',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const isUserExist = await User.checkDuplicateUser(email);

                if (isUserExist) {
                    return done(null, false, { message: 'User already exists' });
                }

                bcrypt.hash(password, 10, function(err, hash) {
                    const user = new User(email, hash)

                    User.insert(user)

                    return done(null, user);
                });
            } catch (error) {
                done(error);
            }
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
            try {
                const user= await User.findOne(email);

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await User.validatePassword(password, user.password)

                if (!validate) {
                    return done(null, false, {message: 'Wrong password'});
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    new JwtStrategy(
        {
            secretOrKey: process.env.JWT_SECRET ?? '',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);