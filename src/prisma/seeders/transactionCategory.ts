import {PrismaClient} from "@prisma/client";

export async function seedTransactionCategories(prisma: PrismaClient) {
    await prisma.transactionCategory.create({
        data: {
            name: "Salary",
            type: "income",
        },
    })
    await prisma.transactionCategory.create({
        data: {
            name: "Entertainment",
            type: "expense",
        },
    })
}

module.exports = { seedTransactionCategories }