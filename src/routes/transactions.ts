import express from 'express';
import {prisma} from "../app";
import { JwtUser } from "../helpers/types";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const jwtUser = req.user as JwtUser

        const transactions = await prisma.transaction.findMany({
            include: {
              asset: true,
              category: true,
            },
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
        const body = req.body

        const transaction = await prisma.transaction.create({
            data: {
                description: body.description,
                amount: body.amount,
                categoryId: body.categoryId,
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
                OR: [
                    {
                        userId: null,
                    },
                    {
                        userId: jwtUser.id,
                    },
                ],
            }
        });

        res.status(200).json({
            success: true,
            transactionCategories: transactionCategories
        })
    } catch (e) {
        console.error(e)

        res.status(500).json({
            success: false,
            message: 'Create transaction failed.'
        })
    }
});

router.post('/categories', async (req, res) => {
    try {
        const jwtUser = req.user as JwtUser
        const body = req.body

        const transactionCategory = await prisma.transactionCategory.create({
            data: {
                name: body.name,
                type: body.type,
                userId: jwtUser.id,
            }
        })

        res.status(200).json({
            success: true,
            transactionCategory: transactionCategory
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
