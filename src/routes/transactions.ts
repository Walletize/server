import express from 'express';
import { prisma } from "../app";
import { Prisma } from '@prisma/client';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const transaction = req.body;

        await prisma.transaction.create({
            data: transaction
        });

        return res.status(200).json();
    } catch (e) {
        console.error(e);
    }
}
);

router.get('/types', async (req, res) => {
    try {
        const transactionTypes = await prisma.transactionType.findMany({
            include: {
                transactionCategories: true,
            }
        })

        return res.status(200).json(transactionTypes);
    } catch (e) {
        console.error(e);
    }
}
);

router.get('/account/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    const grouped = req.query.grouped;
    const startDateStr = req.query.startDate;
    const endDateStr = req.query.endDate;

    try {
        if (grouped == "daily") {
            let whereClause = Prisma.sql`WHERE fa.id = ${accountId}`;

            if (startDateStr && startDateStr != "" && endDateStr && endDateStr != "") {
                whereClause = Prisma.sql`WHERE fa.id = ${accountId} AND t.date >= ${startDateStr}::date AND t.date < ${endDateStr}::date`;
            }

            const rawGroupedTransactions: any = await prisma.$queryRaw`
                SELECT DATE_TRUNC('day', t.date) AS "transactionDate",
                    SUM(t.amount) AS "totalAmount",
                    array_agg(json_build_object(
                        'id', t.id,
                        'description', t.description,
                        'amount', t.amount,
                        'date', t.date,
                        'createdAt', t.created_at,
                        'updatedAt', t.updated_at,
                        'transactionCategory', json_build_object(
                            'id', tc.id,
                            'name', tc.name,
                            'typeId', tc.type_id,
                            'createdAt', tc.created_at,
                            'updatedAt', tc.updated_at,
                            'transactionType', json_build_object(
                                'id', tt.id,
                                'name', tt.name,
                                'createdAt', tt.created_at,
                                'updatedAt', tt.updated_at
                            )
                        ),
                        'financialAccount', json_build_object(
                            'id', fa.id,
                            'name', fa.name,
                            'userId', fa.user_id,
                            'categoryId', fa.category_id,
                            'initialValue', fa.initial_value,
                            'createdAt', fa.created_at,
                            'updatedAt', fa.updated_at
                        ),
                        'currency', json_build_object(
                            'id', c.id,
                            'code', c.code,
                            'name', c.name,
                            'symbol', c.symbol,
                            'rate', c.rate,
                            'createdAt', c.created_at,
                            'updatedAt', c.updated_at
                        )
                    ) ORDER BY t.created_at DESC) AS transactions
                FROM transactions t
                JOIN transaction_categories tc ON t.category_id = tc.id
                JOIN transaction_types tt ON tc.type_id = tt.id
                JOIN financial_accounts fa ON t.account_id = fa.id
                JOIN currencies c ON t.currency_id = c.id
                ${whereClause}
                GROUP BY "transactionDate"
                ORDER BY "transactionDate" DESC;
             `;

            const groupedTransactions = JSON.parse(JSON.stringify(rawGroupedTransactions, (_, value) =>
                typeof value === 'bigint'
                    ? value.toString()
                    : value
            ));

            const totalIncome: any = await prisma.$queryRaw`
                SELECT SUM(t.amount) AS "totalIncome"
                FROM transactions t
                JOIN transaction_categories tc ON t.category_id = tc.id
                JOIN transaction_types tt ON tc.type_id = tt.id
                JOIN financial_accounts fa ON t.account_id = fa.id
                ${whereClause} AND tt.name = 'Income'
            `;

            const totalExpenses: any = await prisma.$queryRaw`
                SELECT SUM(t.amount) AS "totalExpenses"
                FROM transactions t
                JOIN transaction_categories tc ON t.category_id = tc.id
                JOIN transaction_types tt ON tc.type_id = tt.id
                JOIN financial_accounts fa ON t.account_id = fa.id
                ${whereClause} AND tt.name = 'Expense'
            `;

            const combinedResults = {
                totalIncome: totalIncome[0]?.totalIncome || 0,
                totalExpenses: totalExpenses[0]?.totalExpenses || 0,
                groupedTransactions
            };

            return res.status(200).json(combinedResults);
        } else {
            const transactions = await prisma.transaction.findMany({
                where: {
                    financialAccount: {
                        id: accountId
                    }
                },
                include: {
                    financialAccount: true,
                    transactionCategory: {
                        include: {
                            transactionType: true
                        }
                    }
                },
                orderBy: [
                    {
                        date: 'desc',
                    },
                ],
            })

            const json = JSON.parse(JSON.stringify(transactions, (_, value) =>
                typeof value === 'bigint'
                    ? value.toString()
                    : value
            ));
            return res.status(200).json(json);
        }
    } catch (e) {
        console.error(e);

        return res.status(500).json({ message: "Internal error" });
    }
}
);

router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const grouped = req.query.grouped;
    const startDateStr = req.query.startDate;
    const endDateStr = req.query.endDate;

    try {
        if (grouped == "daily") {
            let whereClause = Prisma.sql`WHERE fa.user_id = ${userId}`;

            if (startDateStr && startDateStr != "" && endDateStr && endDateStr != "") {
                whereClause = Prisma.sql`WHERE fa.user_id = ${userId} AND t.date >= ${startDateStr}::date AND t.date < ${endDateStr}::date`;
            }

            const rawGroupedTransactions: any = await prisma.$queryRaw`
                SELECT DATE_TRUNC('day', t.date) AS "transactionDate",
                    SUM(t.amount) AS "totalAmount",
                    array_agg(json_build_object(
                        'id', t.id,
                        'description', t.description,
                        'amount', t.amount,
                        'convertedAmount', CASE 
                            WHEN t.currency_id != fa.currency_id THEN t.amount / c.rate * fc.rate
                            ELSE t.amount 
                        END,
                        'date', t.date,
                        'rate', t.rate,
                        'accountId', t.account_id,
                        'currencyId', t.currency_id,
                        'createdAt', t.created_at,
                        'updatedAt', t.updated_at,
                        'transactionCategory', json_build_object(
                            'id', tc.id,
                            'name', tc.name,
                            'typeId', tc.type_id,
                            'createdAt', tc.created_at,
                            'updatedAt', tc.updated_at,
                            'transactionType', json_build_object(
                                'id', tt.id,
                                'name', tt.name,
                                'createdAt', tt.created_at,
                                'updatedAt', tt.updated_at
                            )
                        ),
                        'financialAccount', json_build_object(
                            'id', fa.id,
                            'name', fa.name,
                            'userId', fa.user_id,
                            'categoryId', fa.category_id,
                            'currencyId', fa.currency_id,
                            'initialValue', fa.initial_value,
                            'createdAt', fa.created_at,
                            'updatedAt', fa.updated_at,
                            'currency', json_build_object(
                                'id', fc.id,
                                'code', fc.code,
                                'name', fc.name,
                                'symbol', fc.symbol,
                                'rate', fc.rate,
                                'createdAt', fc.created_at,
                                'updatedAt', fc.updated_at
                            )
                        ),
                        'currency', json_build_object(
                            'id', c.id,
                            'code', c.code,
                            'name', c.name,
                            'symbol', c.symbol,
                            'rate', c.rate,
                            'createdAt', c.created_at,
                            'updatedAt', c.updated_at
                        )
                    ) ORDER BY t.created_at DESC) AS transactions
                FROM transactions t
                JOIN transaction_categories tc ON t.category_id = tc.id
                JOIN transaction_types tt ON tc.type_id = tt.id
                JOIN financial_accounts fa ON t.account_id = fa.id
                JOIN currencies c ON t.currency_id = c.id
                JOIN currencies fc ON fa.currency_id = fc.id
                ${whereClause}
                GROUP BY "transactionDate"
                ORDER BY "transactionDate" DESC;
             `;

            const groupedTransactions = JSON.parse(JSON.stringify(rawGroupedTransactions, (_, value) =>
                typeof value === 'bigint'
                    ? value.toString()
                    : value
            ));

            const totalIncome: any = await prisma.$queryRaw`
                SELECT SUM(t.amount) AS "totalIncome"
                FROM transactions t
                JOIN transaction_categories tc ON t.category_id = tc.id
                JOIN transaction_types tt ON tc.type_id = tt.id
                JOIN financial_accounts fa ON t.account_id = fa.id
                ${whereClause} AND tt.name = 'Income'
            `;

            const totalExpenses: any = await prisma.$queryRaw`
                SELECT SUM(t.amount) AS "totalExpenses"
                FROM transactions t
                JOIN transaction_categories tc ON t.category_id = tc.id
                JOIN transaction_types tt ON tc.type_id = tt.id
                JOIN financial_accounts fa ON t.account_id = fa.id
                ${whereClause} AND tt.name = 'Expense'
            `;

            const combinedResults = {
                totalIncome: totalIncome[0]?.totalIncome || 0,
                totalExpenses: totalExpenses[0]?.totalExpenses || 0,
                groupedTransactions
            };

            return res.status(200).json(combinedResults);
        } else {
            const transactions = await prisma.transaction.findMany({
                where: {
                    financialAccount: {
                        userId: userId
                    }
                },
                include: {
                    financialAccount: true,
                    transactionCategory: {
                        include: {
                            transactionType: true
                        }
                    }
                },
                orderBy: [
                    {
                        date: 'desc',
                    },
                ],
            })

            const json = JSON.parse(JSON.stringify(transactions, (_, value) =>
                typeof value === 'bigint'
                    ? value.toString()
                    : value
            ));
            return res.status(200).json(json);
        }
    } catch (e) {
        console.error(e);

        return res.status(500).json({ message: "Internal error" });
    }
}
);

router.put('/:transactionId', async (req, res) => {
    const transactionId = req.params.transactionId;
    const updatedAccount = req.body;

    try {
        await prisma.transaction.update({
            where: {
                id: transactionId,
            },
            data: updatedAccount
        });

        return res.status(200).json({ message: "Success" });
    } catch (e) {
        console.error(e);

        return res.status(500).json({ message: "Internal error" });
    }
});

router.delete('/:transactionId', async (req, res) => {
    const transactionId = req.params.transactionId;

    try {
        await prisma.transaction.delete({
            where: {
                id: transactionId,
            },
        })

        return res.status(200).json({ message: "Success" });
    } catch (e) {
        console.error(e);

        return res.status(500).json({ message: "Internal error" });
    }
});

export default router;
