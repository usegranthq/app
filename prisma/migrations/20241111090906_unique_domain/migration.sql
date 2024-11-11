/*
  Warnings:

  - A unique constraint covering the columns `[domain]` on the table `domain` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "domain_domain_key" ON "domain"("domain");
