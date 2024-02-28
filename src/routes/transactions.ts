import express from 'express';
import {prisma} from "../app";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany()

        res.json({
            success: true,
            transactions: transactions
        })
    } catch (e) {
        console.error(e)

        res.status(500).json({
            success: false,
            message: 'Get transactions failed.'
        })
    }
});

router.post('/', async (req, res) => {
    try {
        const body = req.body

        const transaction = await prisma.transaction.create({
            data: {
                title: body.title,
                description: body.description,
                amount: body.amount,
                assetId: body.assetId,
                type: body.type,
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
            message: 'Create transaction failed.'
        })
    }
});

export default router;
