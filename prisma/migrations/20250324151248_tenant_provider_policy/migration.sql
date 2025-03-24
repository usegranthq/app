/*
  Warnings:

  - You are about to drop the column `conditions` on the `tenant_provider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tenant_provider" DROP COLUMN "conditions";

-- CreateTable
CREATE TABLE "tenant_provider_policy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "conditions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantProviderId" TEXT NOT NULL,

    CONSTRAINT "tenant_provider_policy_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tenant_provider_policy" ADD CONSTRAINT "tenant_provider_policy_tenantProviderId_fkey" FOREIGN KEY ("tenantProviderId") REFERENCES "tenant_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
