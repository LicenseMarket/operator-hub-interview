/*
  Warnings:

  - Added the required column `name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('GET', 'POST', 'DELETE', 'PATCH', 'PUT');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "status" "OrderStatus" NOT NULL;

-- CreateTable
CREATE TABLE "Label" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);
