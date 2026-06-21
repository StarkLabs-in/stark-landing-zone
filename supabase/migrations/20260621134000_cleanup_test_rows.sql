-- Removes test rows inserted while verifying the leads.community column
-- and RLS behavior before launch.
DELETE FROM leads WHERE parent_name LIKE '__TEST_VERIFY%';
DELETE FROM parents WHERE parent_name = '__TEST__';
