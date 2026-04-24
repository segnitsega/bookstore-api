-- AlterTable
ALTER TABLE "Order" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE "Order" ADD COLUMN "stripeSessionId" TEXT;

CREATE UNIQUE INDEX "Order_stripeSessionId_key" ON "Order"("stripeSessionId");

ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
