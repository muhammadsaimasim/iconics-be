-- This migration only adds a new table for previous-conference journal metadata.
-- It does not modify or remove any existing data.
CREATE TABLE "previous_conference_publications" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "journalUrl" TEXT,
    "isbn" TEXT,
    "issn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "previous_conference_publications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "previous_conference_publications_year_key"
ON "previous_conference_publications"("year");
