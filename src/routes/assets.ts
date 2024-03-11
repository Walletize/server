import express from 'express';
import {prisma} from "../app";
import { JwtUser } from "../helpers/types";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const jwtUser = req.user as JwtUser

        const assets = await prisma.asset.findMany({
            where: {
                userId: {
                    equals: jwtUser.id,
                },
            },
        });

        res.status(200).json({
            success: true,
            assets: assets
        })
    } catch (e) {
        console.error(e)

        res.status(500).json({
            success: false,
            message: 'Create asset failed.'
        })
    }
});

router.post('/', async (req, res) => {
    try {
        const jwtUser = req.user as JwtUser
        const body = req.body

        const asset = await prisma.asset.create({
            data: {
                name: body.name,
                initialBalance: body.initialBalance,
                currencyId: body.currencyId,
                userId: jwtUser.id,
            }
        })

        res.json({
            success: true,
            asset: asset
        })
    } catch (e) {
        console.error(e)

        res.status(500).json({
            success: false,
            message: 'Create asset failed.'
        })
    }
});

export default router;
