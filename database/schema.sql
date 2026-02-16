-- =====================================================
-- NATIONAL MIGRANT NETWORK (NMN) DATABASE SCHEMA
-- PostgreSQL Database: nmn_db
-- =====================================================

-- Create database (run separately if needed)
-- CREATE DATABASE nmn_db;

-- Connect to database
-- \c nmn_db;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ADMINS TABLE
-- =====================================================
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admins_email ON admins(email);

-- =====================================================
-- 2. SITE SETTINGS TABLE
-- =====================================================
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    site_title VARCHAR(255) DEFAULT 'National Migrant Network',
    site_tagline TEXT,
    logo_url VARCHAR(500),
    favicon_url VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_address TEXT,
    facebook_url VARCHAR(500),
    twitter_url VARCHAR(500),
    instagram_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    youtube_url VARCHAR(500),
    map_embed_url TEXT,
    footer_text TEXT,
    about_text TEXT,
    mission TEXT,
    vision TEXT,
    values TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO site_settings (site_title, site_tagline) VALUES
('National Migrant Network', 'Empowering Migrant Workers for Human Rights and Social Justice');

-- =====================================================
-- 3. PAGES TABLE (Dynamic CMS Pages)
-- =====================================================
CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    meta_description TEXT,
    is_published BOOLEAN DEFAULT true,
    author_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_published ON pages(is_published);

-- =====================================================
-- 4. PROGRAMS TABLE
-- =====================================================
CREATE TABLE programs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    full_description TEXT,
    image_url VARCHAR(500),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'ongoing', -- ongoing, completed, upcoming
    location VARCHAR(255),
    beneficiaries INTEGER,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_programs_slug ON programs(slug);
CREATE INDEX idx_programs_status ON programs(status);
CREATE INDEX idx_programs_featured ON programs(is_featured);

-- =====================================================
-- 5. EVENTS TABLE
-- =====================================================
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    full_description TEXT,
    image_url VARCHAR(500),
    event_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    location VARCHAR(255),
    venue TEXT,
    registration_link VARCHAR(500),
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    max_participants INTEGER,
    created_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_published ON events(is_published);

-- =====================================================
-- 6. NEWS TABLE
-- =====================================================
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    summary TEXT,
    content TEXT,
    image_url VARCHAR(500),
    category VARCHAR(100), -- news, press-release, announcement, update
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    views INTEGER DEFAULT 0,
    published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_published ON news(is_published);
CREATE INDEX idx_news_date ON news(published_date);

-- =====================================================
-- 7. RESOURCES TABLE
-- =====================================================
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    file_type VARCHAR(50), -- pdf, doc, image, video
    file_size INTEGER, -- in bytes
    category VARCHAR(100), -- report, publication, policy, guide, toolkit
    download_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    uploaded_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_published ON resources(is_published);

-- =====================================================
-- 8. E-LEARNING CATEGORIES TABLE
-- =====================================================
CREATE TABLE elearning_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_elearning_categories_slug ON elearning_categories(slug);

-- Insert default categories
INSERT INTO elearning_categories (name, slug, description, icon, display_order) VALUES
('Legal Rights', 'legal-rights', 'Learn about your legal rights as a migrant worker', 'scale', 1),
('Health & Safety', 'health-safety', 'Health and safety information for migrant workers', 'heart', 2),
('Language Skills', 'language-skills', 'Language learning resources', 'book', 3),
('Job Skills', 'job-skills', 'Professional development and skills training', 'briefcase', 4),
('Financial Literacy', 'financial-literacy', 'Managing money and financial planning', 'dollar', 5);

-- =====================================================
-- 9. E-LEARNING CONTENTS TABLE
-- =====================================================
CREATE TABLE elearning_contents (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES elearning_categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    content_type VARCHAR(50), -- article, video, pdf, audio, quiz
    file_url VARCHAR(500),
    video_url VARCHAR(500),
    duration INTEGER, -- in minutes
    difficulty_level VARCHAR(50), -- beginner, intermediate, advanced
    language VARCHAR(50) DEFAULT 'English',
    is_published BOOLEAN DEFAULT true,
    views INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_elearning_contents_slug ON elearning_contents(slug);
CREATE INDEX idx_elearning_contents_category ON elearning_contents(category_id);
CREATE INDEX idx_elearning_contents_published ON elearning_contents(is_published);

-- =====================================================
-- 10. GALLERY ALBUMS TABLE
-- =====================================================
CREATE TABLE gallery_albums (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(500),
    is_published BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gallery_albums_slug ON gallery_albums(slug);

-- =====================================================
-- 11. GALLERY IMAGES TABLE
-- =====================================================
CREATE TABLE gallery_images (
    id SERIAL PRIMARY KEY,
    album_id INTEGER REFERENCES gallery_albums(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    display_order INTEGER DEFAULT 0,
    uploaded_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gallery_images_album ON gallery_images(album_id);

-- =====================================================
-- 12. CONTACT MESSAGES TABLE
-- =====================================================
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_replied BOOLEAN DEFAULT false,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_messages_read ON contact_messages(is_read);
CREATE INDEX idx_contact_messages_date ON contact_messages(created_at);

-- =====================================================
-- 13. VOLUNTEERS TABLE
-- =====================================================
CREATE TABLE volunteers (
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

CREATE INDEX idx_volunteers_email ON volunteers(email);
CREATE INDEX idx_volunteers_approved ON volunteers(is_approved);

-- =====================================================
-- 14. MEDIA FILES TABLE
-- =====================================================
CREATE TABLE media_files (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50), -- image, document, video, audio
    mime_type VARCHAR(100),
    file_size INTEGER,
    uploaded_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_media_files_type ON media_files(file_type);
CREATE INDEX idx_media_files_uploaded ON media_files(uploaded_by);

-- =====================================================
-- 15. STATISTICS TABLE
-- =====================================================
CREATE TABLE statistics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(255) NOT NULL,
    metric_value INTEGER NOT NULL,
    metric_label VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default statistics
INSERT INTO statistics (metric_name, metric_value, metric_label, display_order) VALUES
('workers_helped', 50000, 'Workers Helped', 1),
('programs_run', 150, 'Programs Run', 2),
('partners', 80, 'Partners', 3),
('years_experience', 15, 'Years of Experience', 4);

-- =====================================================
-- 16. BANNERS/SLIDERS TABLE
-- =====================================================
CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    description TEXT,
    image_url VARCHAR(500),
    button_text VARCHAR(100),
    button_link VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_banners_active ON banners(is_active);

-- =====================================================
-- 17. PARTNERS TABLE
-- =====================================================
CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 18. TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    organization VARCHAR(255),
    testimonial TEXT NOT NULL,
    image_url VARCHAR(500),
    rating INTEGER DEFAULT 5,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_testimonials_published ON testimonials(is_published);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_elearning_categories_updated_at BEFORE UPDATE ON elearning_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_elearning_contents_updated_at BEFORE UPDATE ON elearning_contents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_albums_updated_at BEFORE UPDATE ON gallery_albums FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON media_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_statistics_updated_at BEFORE UPDATE ON statistics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DEFAULT ADMIN USER
-- Password: Admin@123 (Please change after first login)
-- =====================================================
-- Note: Run this after bcrypt is available or hash manually
-- Password hash for 'Admin@123' with bcrypt salt rounds 10
INSERT INTO admins (name, email, password, role) VALUES
('Admin', 'admin@nmn.org', '$2b$10$rXKvvF3qYQZ7sMGXF8Y5Fu3bVsN6p6K7vDKWy8j9Xu4l6NpGhvWN6', 'admin');

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Sample Banner
INSERT INTO banners (title, subtitle, description, image_url, button_text, button_link, display_order, is_active) VALUES
('Empowering Migrant Workers', 'Building a Just and Equitable Society', 'National Migrant Network works towards protecting the rights and dignity of migrant workers across the nation.', '/uploads/banner1.jpg', 'Learn More', '/about', 1, true);

-- Sample Programs
INSERT INTO programs (title, slug, description, full_description, status, is_featured, is_published) VALUES
('Legal Aid Program', 'legal-aid-program', 'Providing free legal assistance to migrant workers facing labor rights violations.', 'Our Legal Aid Program offers comprehensive legal support to migrant workers...', 'ongoing', true, true),
('Skill Development Initiative', 'skill-development-initiative', 'Empowering workers through vocational training and skill enhancement.', 'This initiative focuses on building capacity through targeted skill training...', 'ongoing', true, true);

-- Sample Events
INSERT INTO events (title, slug, description, event_date, location, is_featured, is_published) VALUES
('Workers Rights Workshop', 'workers-rights-workshop', 'Interactive workshop on labor rights and legal protections.', '2026-03-15 10:00:00', 'New Delhi', true, true),
('Community Networking Meet', 'community-networking-meet', 'Quarterly networking event for migrant worker communities.', '2026-03-25 14:00:00', 'Mumbai', false, true);

-- =====================================================
-- END OF SCHEMA
-- =====================================================
