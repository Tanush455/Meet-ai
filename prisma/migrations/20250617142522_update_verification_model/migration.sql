/*
  Warnings:

  - You are about to drop the column `expires` on the `Verification` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `Verification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identifier,value]` on the table `Verification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Verification` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Verification_identifier_token_key";

-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "expires",
DROP COLUMN "token",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Verification_identifier_value_key" ON "Verification"("identifier", "value");
