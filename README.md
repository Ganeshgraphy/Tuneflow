# TuneFlow

A full-stack music streaming application with a React/Vite frontend and an Express/MongoDB backend. The orange-and-black interface includes discovery, persistent audio playback, artist uploads, authentication, and a browser-local music library.
🚀 **Live Demo:** [Experience TuneFlow](https://tuneflow-backend-hjcn.vercel.app/)
## Project structure

```text
TuneFlow/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── styles/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
├── .gitignore
├── FRONTEND_INTEGRATION.md
└── README.md
```

Local `.env` files, `node_modules/`, and generated build output are ignored by Git. Each application installs and runs independently; there is no root package or workspace dependency. Backend source and its local `.env` were moved intact into `backend/`. No frontend source or UI changes were required for the reorganization.

## Backend setup

Use Node.js 20.19+ or a newer supported LTS release and npm.

```powershell
cd backend
npm install
# Fresh checkout only; do not overwrite an existing .env:
Copy-Item .env.example .env
```

For the existing local checkout, `backend/.env` already contains your preserved settings; skip the copy. Configure these variables for a fresh checkout:

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection URI with database-user credentials; URL-encode special characters in credentials. |
| `JWT_SECRET` | Secret used to sign authentication cookies. |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit server key for audio uploads. |
| `MONGO_DNS_SERVERS` | Optional comma-separated DNS resolvers for networks that refuse Atlas SRV lookups, such as `1.1.1.1,8.8.8.8`. |

Keep secrets in `backend/.env`, never in frontend variables. Atlas must allow the application's current public IP and the cluster must be running. The optional DNS override only changes Node's DNS resolver; use resolvers allowed by your network.

```powershell
# From backend/:
npm run dev
# Or run without the development watcher:
npm start
```

The existing development script uses `npx nodemon server.js`; it may download nodemon on first use. The backend listens on port 3000 after MongoDB connects. `server.js` resolves `.env` relative to itself, so `node backend/server.js` also works from the repository root. All original API routes and responses are preserved.

## Frontend setup

Open a second terminal at the repository root:

```powershell
cd frontend
npm install
# Fresh checkout only; preserve any existing local values:
Copy-Item .env.example .env
npm run dev
```

Open the local URL Vite prints (normally http://127.0.0.1:5173).

| Variable | Default / purpose |
| --- | --- |
| `VITE_API_BASE_URL` | `/api`; browser-facing API prefix. Never put secrets in `VITE_` variables. |
| `API_PROXY_TARGET` | `http://127.0.0.1:3000`; development proxy destination. |

The Vite proxy forwards `/api` requests to Express on port 3000, including authentication cookies. Both applications should run together for API features. No proxy change was needed when moving the backend because the HTTP address is unchanged.

On Windows PowerShell with restricted script execution, use `npm.cmd` instead of `npm`.

## Development and verification commands

| Directory | Command | Purpose |
| --- | --- | --- |
| `backend/` | `npm install` | Install backend dependencies. |
| `backend/` | `npm run dev` | Start the backend with nodemon. |
| `backend/` | `npm start` | Start the backend directly. |
| `frontend/` | `npm install` | Install frontend dependencies. |
| `frontend/` | `npm run dev` | Start the frontend with the API proxy. |
| `frontend/` | `npm run build` | Build to `frontend/dist/`. |
| `frontend/` | `node --test src/store/player.test.js` | Run the existing player tests. |
| `frontend/` | `npm run preview` | Preview the static production build. |

The backend's original `npm test` script is a placeholder that exits with an error; no backend test suite currently exists. Static preview does not provide the development API proxy.

For production, serve the frontend build with SPA fallback to `index.html`, and reverse-proxy `/api` to Express on the same origin. An absolute cross-origin API URL requires explicit credentialed CORS and suitable cookie settings in the backend. See the integration notes for existing authentication limitations before public deployment.

## Current capabilities and limits

The frontend supports real catalog requests, song/artist filtering, artist views derived from the catalog, cookie-based login/register/logout, artist track uploads and album creation. A single HTML5 Audio instance handles queue selection, seek, pause, shuffle, repeat-one, mute and volume. Successful uploads clear the title/file fields and show a confirmation popup.

Likes and playlists are browser-local, explicitly labeled, and not account-synced. The current backend returns at most 20 tracks and provides no cover artwork, lyrics, album listing, playlist persistence or profile read/edit endpoint. Track duration is measured during playback. Unsupported features show unavailable states. Full endpoint mappings and known backend constraints are documented in [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md).

Reorganization checks use read-only catalog requests and do not create accounts, upload songs, create albums, or modify database records. Browser checks for those write operations can be performed manually when desired.
