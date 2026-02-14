# NMN Frontend

React frontend for National Migrant Network NGO website.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Update with your API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Server

```bash
npm run dev
```

Application will start on http://localhost:5173

### 4. Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── admin/
│   │   ├── components/      # Admin components
│   │   └── pages/           # Admin pages
│   ├── components/
│   │   └── layout/          # Layout components
│   ├── context/
│   │   └── AuthContext.jsx  # Auth state management
│   ├── pages/               # Public pages
│   ├── services/            # API services
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                  # Static assets
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

### Public Website
- Home page with hero banner
- About us page
- Programs listing
- Events calendar
- News & updates
- E-learning section
- Resources library
- Photo gallery
- Contact form
- Volunteer registration

### Admin Dashboard
- Login authentication
- Dashboard with statistics
- Content management (CRUD)
- File upload
- User submissions management
- Site settings

## Routing

### Public Routes
- `/` - Home
- `/about` - About Us
- `/programs` - Programs
- `/events` - Events
- `/news` - News
- `/resources` - Resources
- `/elearning` - E-Learning
- `/gallery` - Gallery
- `/contact` - Contact Us
- `/join` - Join Us

### Admin Routes (Protected)
- `/admin/login` - Admin Login
- `/admin/dashboard` - Dashboard
- `/admin/programs` - Manage Programs
- `/admin/events` - Manage Events
- `/admin/news` - Manage News
- `/admin/elearning` - Manage E-Learning
- `/admin/resources` - Manage Resources
- `/admin/gallery` - Manage Gallery
- `/admin/volunteers` - Manage Volunteers
- `/admin/messages` - Contact Messages
- `/admin/settings` - Site Settings

## Styling

Built with **Tailwind CSS**:
- Utility-first CSS framework
- Responsive design
- Custom color scheme
- Reusable components

### Color Scheme
- Primary: Blue (#0080ff)
- Secondary: Green (#00af69)
- Text: Gray scales

## State Management

- **React Context** for authentication
- **useState/useEffect** for component state
- **React Router** for navigation

## API Integration

All API calls are handled through service modules:

```javascript
import { programService } from '@/services';

const programs = await programService.getAll();
```

Services available:
- `authService` - Authentication
- `programService` - Programs
- `eventService` - Events
- `newsService` - News
- `resourceService` - Resources
- `elearningService` - E-Learning
- `galleryService` - Gallery
- `contactService` - Contact
- `volunteerService` - Volunteers
- `settingsService` - Settings
- `uploadService` - File Upload

## Authentication

Protected routes require JWT token:

```javascript
<ProtectedRoute>
  <AdminDashboard />
</ProtectedRoute>
```

Token is stored in localStorage and automatically attached to API requests.

## Development Tips

### Adding a New Page

1. Create page component in `src/pages/`
2. Add route in `App.jsx`
3. Link from navigation

### Adding a New Admin Feature

1. Create service method
2. Create admin page component
3. Add protected route
4. Link from admin sidebar

## Deployment

### Vercel/Netlify

1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variable: `VITE_API_URL`

### Manual Deployment

1. Build: `npm run build`
2. Upload `dist` folder to web server
3. Configure environment variables
4. Setup routing (SPA mode)

## Troubleshooting

### API Connection Error
- Verify backend is running
- Check `VITE_API_URL` in `.env`
- Check CORS settings in backend

### Build Error
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm run build -- --force`

### Authentication Issues
- Clear localStorage
- Check token expiration
- Verify admin credentials

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lazy loading for routes
- Image optimization
- Code splitting
- Minification in production

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast compliance
