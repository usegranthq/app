/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `domain` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `domain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "domain" ADD COLUMN     "externalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "domain_externalId_key" ON "domain"("externalId");
