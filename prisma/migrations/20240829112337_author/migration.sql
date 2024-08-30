/*
  Warnings:

  - The primary key for the `testimonials` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `image` on the `testimonials` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `testimonials` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `testimonials` table. All the data in the column will be lost.
  - Added the required column `author` to the `testimonials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_pkey",
DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "user",
ADD COLUMN     "author" JSONB NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "testimonials_id_seq";
