import express from 'express';
import {prisma} from "../app";
import { JwtUser } from "../helpers/types";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const jwtUser = req.user as JwtUser

        const transactions = await prisma.transaction.findMany({
            where: {
                asset: {
                    users: {
                        id: jwtUser.id
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            transactions: transactions
        })
    } catch (e) {
        console.error(e)

        res.status(500).json({
            success: false,
            message: 'Create transaction failed.'
        })
    }
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
                date: body.date,
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

router.get('/categories', async (req, res) => {
    try {
        const jwtUser = req.user as JwtUser

        const transactionCategories = await prisma.transactionCategory.findMany({
            where: {
                asset: {
                    users: {
                        id: jwtUser.id
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            transactions: transactionCategories
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
