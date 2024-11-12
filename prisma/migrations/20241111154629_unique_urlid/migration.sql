/*
  Warnings:

  - A unique constraint covering the columns `[urlId]` on the table `project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "project_urlId_key" ON "project"("urlId");
