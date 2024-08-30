/*
  Warnings:

  - Added the required column `formDetails` to the `forms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "forms" ADD COLUMN     "formDetails" JSONB NOT NULL;
