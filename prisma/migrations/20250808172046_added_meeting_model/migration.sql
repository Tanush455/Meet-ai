/*
  Warnings:

  - Added the required column `EndedAt` to the `meetings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StartedAt` to the `meetings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `meetings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recordingUrl` to the `meetings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `meetings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transcriptUrl` to the `meetings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `meetings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('upcoming', 'active', 'complete', 'processing', 'cancelled');

-- AlterTable
ALTER TABLE "meetings" ADD COLUMN     "EndedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "StartedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "recordingUrl" TEXT NOT NULL,
ADD COLUMN     "status" "MeetingStatus" NOT NULL DEFAULT 'upcoming',
ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "transcriptUrl" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
