import {PrismaClient} from "@prisma/client";

export async function seedCurrencies(prisma: PrismaClient) {
    await prisma.currency.upsert({
        where: {id: 1},
        update: {
            id: 1,
            name: "United States Dollars",
            code: "USD",
            symbol: "$",
        },
        create: {
            id: 1,
            name: "United States Dollars",
            code: "USD",
            symbol: "$",
        },
    })
}

module.exports = { seedCurrencies }