-- Migration number: 0001 	 2024-05-19T10:38:46.624Z
ALTER TABLE urls
ADD COLUMN domain TEXT;
