-- CreateTable
CREATE TABLE "stack_items" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "healthGoal" TEXT,
    "isDaily" BOOLEAN NOT NULL DEFAULT true,
    "withFood" BOOLEAN NOT NULL DEFAULT false,
    "morningDose" INTEGER DEFAULT 0,
    "midDayDose" INTEGER DEFAULT 0,
    "eveningDose" INTEGER DEFAULT 0,
    "nightDose" INTEGER DEFAULT 0,
    "aiSuggestion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stack_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stack_items_userId_productId_key" ON "stack_items"("userId", "productId");

-- AddForeignKey
ALTER TABLE "stack_items" ADD CONSTRAINT "stack_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stack_items" ADD CONSTRAINT "stack_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
