/*
  Warnings:

  - You are about to drop the column `orderId` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `totalnumber` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "orderId",
DROP COLUMN "totalnumber";
