-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'IN_PREPARATION';
ALTER TYPE "Status" ADD VALUE 'READY_FOR_DELIVERY';
ALTER TYPE "Status" ADD VALUE 'IN_DELIVERY';
ALTER TYPE "Status" ADD VALUE 'DELIVERED';
ALTER TYPE "Status" ADD VALUE 'ACCEPTED_BY_DELIVERY';
ALTER TYPE "Status" ADD VALUE 'OUT_FOR_DELIVERY';
ALTER TYPE "Status" ADD VALUE 'DELIVERY_COMPLETED';
ALTER TYPE "Status" ADD VALUE 'DELIVERY_FAILED';

-- AlterTable
ALTER TABLE "Diet" ADD COLUMN     "assignedAt" TIMESTAMP(3),
ADD COLUMN     "deliveryCompletedAt" TIMESTAMP(3),
ADD COLUMN     "deliveryNotes" TEXT,
ADD COLUMN     "deliveryStartedAt" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "preparedAt" TIMESTAMP(3);
