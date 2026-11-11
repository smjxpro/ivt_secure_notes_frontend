# Secure Notes Frontend

React + TypeScript + Vite Single Page Application for Secure Notes.

## Prerequisites
- Node.js (v18+)
- Backend running on `http://localhost:5001`

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
Vite is configured in [vite.config.ts](file:///Users/smjxpro/RND/ivt_%20careguidebd/frontend/vite.config.ts) to forward `/api` requests to `http://localhost:5001`:

```ts
proxy: {
  '/api': {
    target: 'http://localhost:5001',
    changeOrigin: true,
  },
}
```

## Features
- **User Authentication**: Register and Login with JWT token storage.
- **Auto Session Restoration**: Loads profile on initial load using saved token; logs out cleanly if token is invalid.
- **Notes Management**: Create, list (with pagination), and delete notes.
- **Admin Panel**: Role-based access displaying system users for admin accounts.

## Build
```bash
npm run build
```
