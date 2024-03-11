/*
  Warnings:

  - You are about to drop the column `title` on the `transactions` table. All the data in the column will be lost.
  - Changed the type of `type` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('expense', 'income');

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "title",
DROP COLUMN "type",
ADD COLUMN     "type" "TransactionType" NOT NULL;
