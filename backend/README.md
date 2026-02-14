# NMN Backend API

Backend API for National Migrant Network NGO website.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=nmn_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_very_long_secret_key_min_64_characters
JWT_EXPIRES_IN=7d

MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 3. Setup Database

Create PostgreSQL database and run schema:

```bash
createdb nmn_db
psql -d nmn_db -f ../database/schema.sql
```

### 4. Run the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will start on http://localhost:5000

## API Documentation

### Authentication

**Admin Login**
```
POST /api/auth/login
Body: { email, password }
```

**Get Profile** (Protected)
```
GET /api/auth/profile
Headers: Authorization: Bearer <token>
```

### Programs

**Get All Programs** (Public)
```
GET /api/programs?page=1&limit=10&status=ongoing
```

**Create Program** (Admin)
```
POST /api/programs/admin
Headers: Authorization: Bearer <token>
Body: { title, description, ... }
```

### File Upload

**Upload Single File** (Admin)
```
POST /api/upload/single
Headers: Authorization: Bearer <token>
Form-Data: file
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # PostgreSQL connection
│   │   └── multer.js        # File upload config
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Auth & validation
│   ├── routes/              # API routes
│   └── utils/               # Helper functions
├── uploads/                 # Uploaded files
├── app.js                   # Express app setup
├── server.js               # Server entry point
└── package.json
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development/production) | development |
| PORT | Server port | 5000 |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_NAME | Database name | nmn_db |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | - |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRES_IN | Token expiration | 7d |

## Default Admin Credentials

```
Email: admin@nmn.org
Password: Admin@123
```

**Change these after first login!**

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation
- SQL injection prevention
- CORS protection
- Helmet security headers
- File type validation

## Error Handling

All errors return JSON format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Testing

You can test the API using:
- Postman
- Thunder Client (VS Code)
- curl commands

Example curl:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nmn.org","password":"Admin@123"}'
```
