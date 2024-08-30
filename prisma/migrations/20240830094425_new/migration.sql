/*
  Warnings:

  - Added the required column `user` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "user" TEXT NOT NULL;
