/*
  Warnings:

  - The primary key for the `testimonials` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `type` to the `testimonials` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `testimonials` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_pkey",
ADD COLUMN     "type" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ,
ADD CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id");
