-- Adds a list of workshop titles to speakers. Additive only; existing rows get an empty list.
ALTER TABLE "speakers" ADD COLUMN "workshops" TEXT[] DEFAULT ARRAY[]::TEXT[];
