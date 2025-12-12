-- CreateTable
CREATE TABLE "stack_logs" (
    "id" SERIAL NOT NULL,
    "stackItemId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stack_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stack_logs_stackItemId_date_timeSlot_key" ON "stack_logs"("stackItemId", "date", "timeSlot");

-- AddForeignKey
ALTER TABLE "stack_logs" ADD CONSTRAINT "stack_logs_stackItemId_fkey" FOREIGN KEY ("stackItemId") REFERENCES "stack_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stack_logs" ADD CONSTRAINT "stack_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
