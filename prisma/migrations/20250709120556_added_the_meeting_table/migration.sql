-- CreateTable
CREATE TABLE "meetings" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
