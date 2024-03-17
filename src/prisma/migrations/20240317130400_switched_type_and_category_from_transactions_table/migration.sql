/*
  Warnings:

  - You are about to drop the column `type` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `type` to the `transaction_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaction_categories" ADD COLUMN     "type" "TransactionType" NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "type",
ADD COLUMN     "category_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "transaction_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
