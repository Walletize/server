/*
  Warnings:

  - You are about to drop the column `asset_id` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `assetId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_asset_id_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "asset_id",
ADD COLUMN     "assetId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
