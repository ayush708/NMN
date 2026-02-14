# Database Setup Guide

PostgreSQL database schema for National Migrant Network (NMN).

## Quick Setup

### 1. Create Database

```bash
createdb nmn_db
```

Or using psql:
```sql
CREATE DATABASE nmn_db;
```

### 2. Run Schema

```bash
psql -d nmn_db -f schema.sql
```

Or copy and paste the contents of `schema.sql` into psql.

## Database Overview

### Tables Created

1. **admins** - Admin user accounts
2. **site_settings** - Site configuration
3. **pages** - Dynamic CMS pages
4. **programs** - NGO programs
5. **events** - Events and workshops
6. **news** - News articles and press releases
7. **resources** - Downloadable documents
8. **elearning_categories** - E-learning categories
9. **elearning_contents** - E-learning materials
10. **gallery_albums** - Photo albums
11. **gallery_images** - Gallery images
12. **contact_messages** - Contact form submissions
13. **volunteers** - Volunteer applications
14. **media_files** - Uploaded files metadata
15. **statistics** - Homepage statistics
16. **banners** - Homepage banners/sliders
17. **partners** - Partner organizations
18. **testimonials** - User testimonials

### Default Data Included

- Default admin user (admin@nmn.org)
- Default site settings
- E-learning categories
- Sample statistics
- Sample banners
- Sample programs and events

## Database Connection

Use these credentials in your backend `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nmn_db
DB_USER=postgres
DB_PASSWORD=your_password
```

## Default Admin Credentials

After running the schema, you can login with:

```
Email: admin@nmn.org
Password: Admin@123
```

**⚠️ Change these immediately after first login!**

## Schema Features

### Automatic Timestamps

All tables have `created_at` and `updated_at` columns that are automatically managed by triggers.

### Foreign Keys

Tables are properly linked with foreign key constraints:
- `programs.created_by` → `admins.id`
- `events.created_by` → `admins.id`
- `news.author_id` → `admins.id`
- etc.

### Indexes

Optimized with indexes on:
- Primary keys
- Foreign keys
- Frequently queried columns (slugs, dates, status)

### Data Integrity

- NOT NULL constraints on required fields
- UNIQUE constraints on emails, slugs
- CHECK constraints on enums
- Default values for status fields
- Cascading deletes where appropriate

## Backup and Restore

### Create Backup

```bash
pg_dump nmn_db > nmn_backup.sql
```

### Restore from Backup

```bash
psql nmn_db < nmn_backup.sql
```

## Database Migrations

For production, consider using a migration tool like:
- [node-pg-migrate](https://github.com/salsita/node-pg-migrate)
- [db-migrate](https://github.com/db-migrate/node-db-migrate)
- [Knex.js](https://knexjs.org/)

## Common Queries

### View All Tables

```sql
\dt
```

### Check Table Structure

```sql
\d table_name
```

### View All Admins

```sql
SELECT id, name, email, role FROM admins;
```

### Count Records

```sql
SELECT
  (SELECT COUNT(*) FROM programs) as programs,
  (SELECT COUNT(*) FROM events) as events,
  (SELECT COUNT(*) FROM news) as news,
  (SELECT COUNT(*) FROM volunteers) as volunteers;
```

## Troubleshooting

### Connection Refused

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

### Database Already Exists

```bash
# Drop and recreate
dropdb nmn_db
createdb nmn_db
psql -d nmn_db -f schema.sql
```

### Permission Denied

```bash
# Login as postgres user
sudo -u postgres psql

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE nmn_db TO your_user;
```

## Production Considerations

1. **Use connection pooling** (already configured in backend)
2. **Regular backups** (set up cron job)
3. **Monitor performance** (use pg_stat_statements)
4. **Optimize queries** (add indexes as needed)
5. **Security** (use strong passwords, restrict access)

## PostgreSQL Configuration

Recommended settings in `postgresql.conf`:

```conf
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
```

## Table Size Information

```sql
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```
