/*
  Warnings:

  - You are about to drop the column `eur` on the `exchange_rate` table. All the data in the column will be lost.
  - Added the required column `fromEur` to the `exchange_rate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exchange_rate" DROP COLUMN "eur",
ADD COLUMN     "fromEur" DOUBLE PRECISION NOT NULL;
