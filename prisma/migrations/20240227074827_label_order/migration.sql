-- CreateTable
CREATE TABLE "_LabelToOrder" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LabelToOrder_AB_unique" ON "_LabelToOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_LabelToOrder_B_index" ON "_LabelToOrder"("B");

-- AddForeignKey
ALTER TABLE "_LabelToOrder" ADD CONSTRAINT "_LabelToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LabelToOrder" ADD CONSTRAINT "_LabelToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
