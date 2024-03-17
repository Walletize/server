import {PrismaClient} from "@prisma/client";

export async function seedTransactionCategories(prisma: PrismaClient) {
    await prisma.transactionCategory.upsert({
        where: {id: 1},
        update: {
            id: 1,
            name: "Salary",
            type: "income",
        },
        create: {
            id: 1,
            name: "Salary",
            type: "income",
        },
    })
    await prisma.transactionCategory.upsert({
        where: {id: 2},
        update: {
            id: 2,
            name: "Entertainment",
            type: "expense",
        },
        create: {
            id: 2,
            name: "Entertainment",
            type: "expense",
        },
    })
}

module.exports = { seedTransactionCategories }