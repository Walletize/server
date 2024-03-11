import express from 'express';
import {prisma} from "../app";
import { JwtUser } from "../helpers/types";
import { TransactionType } from "@prisma/client";

const router = express.Router();

router.get('/', async (req, res) => {

});

router.post('/', async (req, res) => {
    try {
        const jwtUser = req.user as JwtUser
        const body = req.body

        const transaction = await prisma.transaction.create({
            data: {
                description: body.description,
                amount: body.amount,
                type: body.type,
                assetId: body.assetId,
            }
        })

        res.json({
            success: true,
            transaction: transaction
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
