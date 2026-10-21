-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_customerId_fkey";

-- DropForeignKey
ALTER TABLE "customer" DROP CONSTRAINT "customer_userId_fkey";

-- DropTable
DROP TABLE "subscription";

-- DropTable
DROP TABLE "customer";
