/*
  Warnings:

  - You are about to drop the column `formDetails` on the `forms` table. All the data in the column will be lost.
  - Added the required column `formCustomerDetails` to the `forms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formDesign` to the `forms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formResponseDetails` to the `forms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formThanksDetails` to the `forms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formWelcomeDetails` to the `forms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "forms" DROP COLUMN "formDetails",
ADD COLUMN     "formCustomerDetails" JSONB NOT NULL,
ADD COLUMN     "formDesign" JSONB NOT NULL,
ADD COLUMN     "formResponseDetails" JSONB NOT NULL,
ADD COLUMN     "formThanksDetails" JSONB NOT NULL,
ADD COLUMN     "formWelcomeDetails" JSONB NOT NULL;
