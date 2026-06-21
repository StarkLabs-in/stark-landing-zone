-- Adds the "which community do you belong to" field to leads, so we can see
-- where Future AI Club interest is coming from before investing in a venue.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS community TEXT;
