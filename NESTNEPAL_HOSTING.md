# NestNepal Web Hosting Guide

This project has two parts:

- `frontend` is a Vite React app and can be hosted on standard web hosting after build.
- `backend` is an Express/Node.js API and needs Node.js support or a separate server/VPS.

## Frontend on web hosting

1. Set `frontend/.env` for production before building:

   ```env
   VITE_API_URL=https://your-api-domain.com/api
   VITE_SITE_URL=https://nmnhas.org.np
   ```

2. Run the frontend build:

   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. Upload the contents of `frontend/dist` to the hosting document root.

4. Keep `frontend/public/.htaccess` in the deployed root so React routes reload correctly.

## Backend on web hosting

If NestNepal gives you Node.js hosting, deploy the `backend` folder as a separate app:

1. Install backend dependencies.
2. Set environment variables such as:

   ```env
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=your_postgres_url
   CLIENT_URL=https://nmnhas.org.np
   MAX_FILE_SIZE=10485760
   ```

3. Start the app with `npm start` from the `backend` directory.
4. Point the frontend `VITE_API_URL` to the backend URL.

## Important note

If your NestNepal plan is only shared web hosting, it can host the frontend but not the Node backend. In that case you need one of these options:

- Move the backend to a Node-capable host or VPS.
- Keep the frontend on NestNepal and use an external API host for the backend.

## Already included in this repo

- `frontend/public/.htaccess` for SPA rewrites.
- `render.yaml` for Render deployment.