import {PrismaClient} from "@prisma/client";

export async function seedCurrencies(prisma: PrismaClient) {
    await prisma.currency.create({
        data: {
            id: "1",
            name: "United States Dollars",
            code: "USD",
            symbol: "$",
        },
    })
}

module.exports = { seedCurrencies }