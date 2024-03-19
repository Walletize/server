import {PrismaClient} from "@prisma/client";

export async function seedCurrencies(prisma: PrismaClient) {
    await prisma.currency.create({
        data: {
            name: "United States Dollars",
            code: "USD",
            symbol: "$",
        },
    })
}

module.exports = { seedCurrencies }