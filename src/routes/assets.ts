import express from 'express';
import {prisma} from "../app";
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const body = req.body

        const asset = await prisma.asset.create({
            data: {
                name: body.name,
                initialBalance: body.initialBalance,
                currencyId: body.currencyId,
                userId: body.userId,
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
