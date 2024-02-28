import passport, {use} from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from "bcrypt";
import 'dotenv/config'
import {prisma} from "../app";
import jwt from "jsonwebtoken";
import {JwtToken} from "../helpers/types";

passport.use(
    'signup',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                const body = req.body
                const salt = body.salt
                const key = body.key

                let userCount = await prisma.user.count(
                    {
                        where: {
                            email: email
                        }
                    }
                )

                if (userCount > 0) {
                    return done(null, false, { message: 'User already exists' });
                }

                bcrypt.hash(password, 10, async function (err, hash) {
                    const user = await prisma.user.create({
                        data: {
                            email: email,
                            password: hash,
                            salt: salt,
                            key: key,
                        }
                    })

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
                const user = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                })

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                if (!await bcrypt.compare(password, user.password)) {
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
            const tokenType = token.tokenType

            if (tokenType == 'access') {
                return done(null, token.user);
            } else {
                return done(null, false);
            }
        }
    )
);