# Secure Notes Frontend

React + TypeScript + Vite Single Page Application for Secure Notes.

## Prerequisites
- Node.js (v18+)
- Backend running on `http://localhost:5001`

## Environment Configuration
Create a `.env` file in `frontend/` (see `.env.example`):
```env
VITE_API_URL=/api
VITE_BACKEND_PROXY_TARGET=http://localhost:5001
```
- `VITE_API_URL`: Defines the base path or base URL for backend requests in the frontend code.
- `VITE_BACKEND_PROXY_TARGET`: Target backend server URL used by Vite's development proxy when running locally (`npm run dev`).

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

The app will run at `http://localhost:5173`.

## Vite Proxy Configuration
Vite is configured in [vite.config.ts](file:///Users/smjxpro/RND/ivt_%20careguidebd/frontend/vite.config.ts) to read `VITE_BACKEND_PROXY_TARGET` from the environment during `serve` mode without fallbacks:

```ts
proxy: {
  '/api': {
    target: env.VITE_BACKEND_PROXY_TARGET,
    changeOrigin: true,
  },
}
```

## Docker & Production Deployment
In production, the frontend is built into static assets and served via `nginx:alpine`.
- `default.conf.template` dynamically injects `${BACKEND_API_URL}` (e.g. `http://backend:5001/api/`) via Nginx's template mechanism on startup.
- Build arg `VITE_API_URL` is passed during image building to bake in the client-side API endpoint.

## Features
- **User Authentication**: Register and Login with JWT token storage.
- **Auto Session Restoration**: Loads profile on initial load using saved token; logs out cleanly if token is invalid.
- **Notes Management**: Create, list (with pagination), edit, and delete notes.
- **Admin Panel**: Role-based access displaying, adding, editing, and deleting system users.

## Routing Structure
- `/login`: Public authentication page (sign in and sign up).
- `/notes`: Authenticated notes dashboard wrapped by [`PageLayout`](file:///Users/smjxpro/RND/ivt_%20careguidebd/frontend/src/components/PageLayout.tsx).
- `/aggregations`: Analytics and aggregations view.
- `/admin/users`: Admin-only user management protected by [`AdminRoute`](file:///Users/smjxpro/RND/ivt_%20careguidebd/frontend/src/components/RouteGuards.tsx).

## Build
```bash
npm run build
```
