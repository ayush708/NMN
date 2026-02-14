# National Migrant Network (NMN) - Complete NGO Website

A full-stack NGO website built with React (Vite), Node.js, Express, and PostgreSQL.

## 🎯 Project Overview

This is a production-ready NGO website for **National Migrant Network (NMN)** that works for migrant workers' human rights, social justice, education, policy advocacy, and community networking.

## 🏗️ System Architecture

The system is divided into two completely separate interfaces:

1. **PUBLIC USER WEBSITE** - Visible to everyone (NO admin access)
2. **ADMIN DASHBOARD** - Private admin-only interface for complete system control

## 🛠️ Technology Stack

### Frontend
- **React** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Toastify** for notifications

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** authentication (Admin only)
- **Multer** for file uploads
- **Bcrypt** for password hashing

## 📁 Project Structure

```
NMN/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Database & Multer config
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & validation
│   │   ├── routes/         # API routes
│   │   └── utils/          # Helper functions
│   ├── uploads/            # Uploaded files
│   ├── app.js             # Express app setup
│   ├── server.js          # Server entry point
│   └── package.json
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── admin/         # Admin dashboard
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Public pages
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
└── database/              # Database schema
    └── schema.sql         # PostgreSQL schema
```

## 🚀 Quick Start Guide

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Step 1: Database Setup

1. Create PostgreSQL database:
```bash
createdb nmn_db
```

2. Run the schema:
```bash
psql -d nmn_db -f database/schema.sql
```

### Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nmn_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_min_64_characters
```

5. Start the server:
```bash
npm run dev
```

Backend will run on **http://localhost:5000**

### Step 3: Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on **http://localhost:5173**

## 🔐 Default Admin Credentials

```
Email: admin@nmn.org
Password: Admin@123
```

**⚠️ IMPORTANT: Change these credentials after first login!**

## 📋 Features

### Public Website Features

1. **Home Page**
   - Hero banner with NGO mission
   - Dynamic statistics
   - Featured programs
   - Latest news

2. **About Us**
   - Organization overview
   - Mission, Vision, Values

3. **Programs**
   - List of all programs
   - Program details

4. **E-Learning Section**
   - Categories (Legal Rights, Health, Language, Skills)
   - Articles, PDFs, Videos
   - Search & filter

5. **News & Updates**
   - News articles
   - Event updates
   - Pagination

6. **Events**
   - Upcoming events
   - Past events
   - Event details

7. **Resources**
   - Downloadable reports
   - Publications
   - Policy documents

8. **Gallery**
   - Photo albums
   - Lightbox view

9. **Contact Us**
   - Contact form
   - Organization details

10. **Join Us**
    - Volunteer form
    - Membership request

### Admin Dashboard Features

1. **Dashboard Overview**
   - Statistics cards
   - Recent activity
   - Quick actions

2. **Site Settings**
   - Update logo & site info
   - Social media links
   - Contact details
   - Banners management

3. **Content Management**
   - Programs (CRUD)
   - Events (CRUD)
   - News (CRUD)
   - Resources (CRUD)
   - E-Learning content (CRUD)

4. **Media Management**
   - Upload images & documents
   - Delete files

5. **User Submissions**
   - View contact messages
   - View volunteer applications
   - Approve/reject

6. **Admin Profile**
   - Change password
   - Update profile

## 🗄️ Database Schema

The database includes the following tables:

- `admins` - Admin users
- `site_settings` - Site configuration
- `programs` - NGO programs
- `events` - Events
- `news` - News articles
- `resources` - Downloadable resources
- `elearning_categories` - E-learning categories
- `elearning_contents` - E-learning materials
- `gallery_albums` - Photo albums
- `gallery_images` - Gallery images
- `contact_messages` - Contact form submissions
- `volunteers` - Volunteer applications
- `media_files` - Uploaded files
- `statistics` - Homepage statistics
- `banners` - Homepage banners
- `partners` - Partner organizations
- `testimonials` - User testimonials

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected admin routes
- Input validation
- SQL injection prevention
- CORS configuration
- Secure file uploads

## 📡 API Endpoints

### Public Endpoints
- `GET /api/programs` - Get all programs
- `GET /api/events` - Get all events
- `GET /api/news` - Get all news
- `GET /api/resources` - Get resources
- `GET /api/elearning/categories` - Get e-learning categories
- `GET /api/gallery/albums` - Get gallery albums
- `POST /api/contact` - Submit contact form
- `POST /api/volunteer` - Submit volunteer form

### Admin Endpoints (Requires Authentication)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get admin profile
- `GET /api/settings/admin/dashboard` - Dashboard stats
- `POST /api/programs/admin` - Create program
- `PUT /api/programs/admin/:id` - Update program
- `DELETE /api/programs/admin/:id` - Delete program
- (And many more...)

## 🎨 UI/UX Design

- Professional NGO-style design
- Calm color scheme (blue, green, white)
- Responsive design (mobile-first)
- Accessible typography
- Clean and modern interface
- Trust-building visuals

## 🚢 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Install dependencies: `npm install --production`
3. Run database migrations
4. Start server: `npm start`

### Frontend Deployment

1. Build for production: `npm run build`
2. Deploy the `dist` folder to hosting service
3. Configure environment variables

**Recommended Hosting:**
- Backend: Heroku, Railway, DigitalOcean
- Frontend: Vercel, Netlify, Cloudflare Pages
- Database: Heroku Postgres, Supabase, Railway

## 📝 Development Notes

### Adding New Features

1. **Backend**: Create controller → Add route → Test API
2. **Frontend**: Create service → Create component → Add route

### Code Standards

- Use ESLint for code formatting
- Follow REST API conventions
- Write clear comments
- Use meaningful variable names

## 🐛 Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database `nmn_db` exists

### CORS Error
- Check `CLIENT_URL` in backend `.env`
- Verify frontend is running on correct port

### Upload Error
- Ensure `uploads` directory exists
- Check file size limits in `multer.js`
- Verify file permissions

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Contact: admin@nmn.org

## 📄 License

MIT License - Feel free to use for your NGO projects

## 🙏 Acknowledgments

Built for National Migrant Network to support their mission of empowering migrant workers and promoting human rights and social justice.

---

**🚀 Ready to Run!**

Follow the Quick Start Guide above to get your NGO website up and running in minutes!
