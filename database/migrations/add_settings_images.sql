-- Add image fields to site_settings table
-- Run this after the initial schema

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS mission_image VARCHAR(500),
ADD COLUMN IF NOT EXISTS vision_image VARCHAR(500),
ADD COLUMN IF NOT EXISTS values_image VARCHAR(500),
ADD COLUMN IF NOT EXISTS about_image VARCHAR(500);
