-- Create volunteers table if it doesn't exist
CREATE TABLE IF NOT EXISTS volunteers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    date_of_birth DATE,
    occupation VARCHAR(255),
    organization VARCHAR(255),
    skills TEXT,
    experience TEXT,
    availability VARCHAR(255),
    motivation TEXT,
    how_heard VARCHAR(255),
    is_approved BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    resume_url VARCHAR(500),
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_approved ON volunteers(is_approved);

-- Verify the table was created
SELECT 'Volunteers table created or already exists' AS status;
