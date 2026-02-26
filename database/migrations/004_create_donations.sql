-- Donations table
-- Run this in your PostgreSQL database (nmn_db)

CREATE TABLE IF NOT EXISTS donations (
  id               SERIAL PRIMARY KEY,
  name             VARCHAR(255) NOT NULL DEFAULT 'Anonymous',
  email            VARCHAR(255),
  phone            VARCHAR(50),
  amount           NUMERIC(12, 2) NOT NULL,
  message          TEXT,
  gateway          VARCHAR(20) NOT NULL CHECK (gateway IN ('khalti', 'esewa')),
  pidx             VARCHAR(255),           -- Khalti payment index
  transaction_id   VARCHAR(255),           -- eSewa / Khalti transaction ID
  status           VARCHAR(20) NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'completed', 'failed')),
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for admin queries
CREATE INDEX IF NOT EXISTS idx_donations_status    ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_gateway   ON donations(gateway);
CREATE INDEX IF NOT EXISTS idx_donations_created   ON donations(created_at DESC);
