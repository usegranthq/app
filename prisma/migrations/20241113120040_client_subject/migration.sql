/*
  Warnings:

  - The required column `subject` was added to the `client` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "client" ADD COLUMN     "subject" TEXT NOT NULL;
