import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import bcrypt, {hash} from "bcrypt";
import {prisma} from "../app";
import {JwtToken} from "../helpers/types";

const router = express.Router();

router.post('/signup', async (req, res, next) => {
        passport.authenticate(
            'signup',
            { session: false },
            async (err: any, user: any, info: any) => {
                try {
                    if (err || !user) {
                        return res.status(409).json({
                            success: false,
                            message: info.message
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        message: 'Sign up successful',
                    });
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);

router.post('/login', async (req, res, next) => {
        passport.authenticate(
            'login',
            async (err: any, user: any, info: any) => {
                try {
                    if (err || !user) {
                        return res.status(403).json({
                            success: false,
                            message: info.message
                        });
                    }

                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error);

                            const body = { id: user.id, email: user.email };
                            const accessToken = jwt.sign({ user: body, tokenType: 'access' },
                                process.env.JWT_SECRET ?? '',
                                { expiresIn: '15m' });
                            const refreshToken = jwt.sign({ user: body, tokenType: 'refresh' },
                                process.env.JWT_SECRET ?? '',
                                { expiresIn: '7d' });

                            const hashRefreshToken = await bcrypt.hash(refreshToken, 10)

                            await prisma.user.update({
                                where: {
                                    id: user.id,
                                },
                                data: {
                                    refreshToken: hashRefreshToken
                                },
                            })

                            return res.json({ accessToken: accessToken, refreshToken: refreshToken });
                        }
                    );
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);

router.post('/refresh', async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return res.status(401).send('Access Denied. No refresh token provided');
        }

        const tokenBody = jwt.verify(refreshToken, process.env.JWT_SECRET ?? '') as JwtToken
        const tokenUser = tokenBody.user

        const user = await prisma.user.findUnique({
            where: {
                id: tokenUser.id,
            },
        })

        if (!user) {
            return res.status(401).send('Access Denied. Refresh token is incorrect');
        }

        if (!user.refreshToken) {
            return res.status(401).send('Access Denied. Refresh token is incorrect');
        }

        if (!await bcrypt.compare(refreshToken, user.refreshToken)) {
            return res.status(401).send('Access Denied. Refresh token is incorrect');
        }

        const accessToken = jwt.sign({ user: tokenUser, tokenType: 'access' },
            process.env.JWT_SECRET ?? '',
            { expiresIn: '15m' });

        return res.json({ accessToken: accessToken });
    } catch (e) {
        console.error(e)

        res.status(500).json({
            success: false,
            message: 'Refresh token failed.'
        })
    }
});

export default router;
