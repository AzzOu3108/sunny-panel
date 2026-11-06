# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js 22.12+ and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

Install dependencies in `backend/` and `frontend/` separately. Then run the backend and frontend in separate terminals:

```sh
# Terminal 1 (backend listens on port 8000)
cd backend
npm install
npm run dev

# Terminal 2
cd frontend
npm install
npm run dev
```

## Backend API

The login, signup, and dashboard use the API client in `src/lib/api.js`; the Express API is implemented in `../backend/`. During development, requests to `/api` are proxied to the backend at `http://localhost:8000`. If your backend runs on a different origin, create a `.env.local` file with its API base URL, for example:

```env
VITE_API_URL=http://localhost:8000/api
```

The backend should implement the authentication, projects, and stats endpoints listed in the API client. For a cross-origin backend, set `FRONTEND_URL` in `backend/.env` to the frontend's origin so the backend CORS configuration allows it.

## Built with

- Vite
- TanStack Router
- JavaScript
- React
- Tailwind CSS
