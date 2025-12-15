-- DropForeignKey
ALTER TABLE "stack_items" DROP CONSTRAINT "stack_items_productId_fkey";

-- AddForeignKey
ALTER TABLE "stack_items" ADD CONSTRAINT "stack_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
