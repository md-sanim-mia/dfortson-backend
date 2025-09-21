-- CreateTable
CREATE TABLE "public"."reference_audio" (
    "id" TEXT NOT NULL,
    "audioScenarioId" TEXT NOT NULL,
    "audioData" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reference_audio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reference_audio_audioScenarioId_key" ON "public"."reference_audio"("audioScenarioId");

-- AddForeignKey
ALTER TABLE "public"."reference_audio" ADD CONSTRAINT "reference_audio_audioScenarioId_fkey" FOREIGN KEY ("audioScenarioId") REFERENCES "public"."Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
