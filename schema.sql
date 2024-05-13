DROP TABLE IF EXISTS urls;

CREATE TABLE urls (
    key CHAR(4) PRIMARY KEY,
    value TEXT NOT NULL,
    secret TEXT NOT NULL,
    timestamp DATETIME DEFAULT current_timestamp
);

CREATE INDEX IF NOT EXISTS idx_secret ON urls(secret);
