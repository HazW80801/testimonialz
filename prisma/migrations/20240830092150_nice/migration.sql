/*
  Warnings:

  - Changed the type of `customerId` on the `subscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "customerId",
ADD COLUMN     "customerId" INTEGER NOT NULL;
