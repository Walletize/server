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

        return res.json({
            user: user
        })
    }
);

export default router;
