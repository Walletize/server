import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

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

                            const body = { _id: user._id, email: user.email };
                            const token = jwt.sign({ user: body }, process.env.JWT_SECRET ?? '');

                            return res.json({ token });
                        }
                    );
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);

export default router;
