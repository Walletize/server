-- DropForeignKey
ALTER TABLE "transaction_categories" DROP CONSTRAINT "transaction_categories_user_id_fkey";

-- AlterTable
ALTER TABLE "transaction_categories" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transaction_categories" ADD CONSTRAINT "transaction_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
