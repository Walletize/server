import {PrismaClient} from '@prisma/client';
import {seedCurrencies} from "./currency";
const prisma = new PrismaClient()

async function main() {
    await seedCurrencies(prisma)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
