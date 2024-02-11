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

                bcrypt.genSalt(10, function(err, salt) {
                    const user = new User(email, password, salt)

                    bcrypt.hash(password, salt, function(err, hash) {
                        bcrypt.genSalt(10, function(err, salt) {
                            bcrypt.hash(hash, salt, function(err, hash) {
                                user.password = hash

                                User.insert(user)

                                return done(null, user);
                            });
                        });
                    });
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

                bcrypt.hash(password, user.salt, async function (err, hash) {
                    const validate = await User.validatePassword(hash, user.password)

                    if (!validate) {
                        return done(null, false, {message: 'Wrong password'});
                    }

                    return done(null, user);
                });
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