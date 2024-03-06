import express from 'express';
import jwt from "jsonwebtoken";
import {prisma} from "../app";
import {JwtToken, JwtUser} from "../helpers/types";
const router = express.Router();

router.get(
    '/',
    async (req, res, next) => {
        const jwtUser = req.user as JwtUser

        const user = await prisma.user.findUnique({
            where: {
                id: jwtUser.id,
            },
        })

        if (user) {
            return res.status(200).json({
                user: {
                    id: user.id,
                    email: user.email,
                    salt: user.salt,
                    key: user.key,
                }
            })
        }
    }
);

export default router;
