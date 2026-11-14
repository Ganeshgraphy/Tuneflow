# TuneFlow

React music frontend in `frontend/`, integrated with the existing Express/MongoDB backend. Backend source is preserved.

## Run locally

1. Install backend dependencies with `npm install` at repository root.
2. Configure the root `.env` with `MONGO_URI`, `JWT_SECRET`, and `IMAGEKIT_PRIVATE_KEY`. Never copy these into the frontend.
3. Start the backend with `npm start` (port 3000).
4. In another terminal, `cd frontend`, run `npm install`, copy `.env.example` to `.env`, then `npm run dev`.
5. Open the localhost URL printed by Vite (normally http://127.0.0.1:5173).

On Windows PowerShell with restricted script execution, use `npm.cmd` instead of `npm`.

## Build

If startup reports `querySrv ECONNREFUSED`, the backend supports an optional
`MONGO_DNS_SERVERS=1.1.1.1,8.8.8.8` in the root `.env`. This overrides Node's DNS
resolver for SRV/TXT lookups without changing Windows network settings. Use only
resolvers allowed by your network; remove the setting to use system DNS again.

Run `npm run build` inside `frontend`. Output is `frontend/dist`. `npm run preview` serves the build for visual checks only; it does not provide the development API proxy.

For production, serve the static build with SPA fallback to index.html and reverse-proxy `/api` to the Express server on the same origin. The frontend default base URL is `/api`; `API_PROXY_TARGET` only configures development. Cross-origin deployment needs explicit credentialed CORS and appropriate secure cookie settings in the backend. Backend authentication hardening is needed before public exposure; see integration notes. This delivery is local source and has not been publicly deployed.

## Features

- Responsive orange-and-black discovery shell, responsive navigation, now-playing drawer, record animation and reduced-motion support.
- Real catalog requests with TanStack Query; catalog search by song/artist; artist views derived from returned tracks.
- One HTML5 Audio instance for persistent playback, play/pause, queue selection, previous/next, shuffle, repeat-one, seek, volume, mute and media error states.
- Cookie-based login/register/logout, safe in-memory profile, artist track upload and album creation.
- Browser-local likes and playlists with create/rename/delete and track membership. These are labeled local and never represented as account-synced.
- Honest empty and unavailable states for unsupported APIs; abstract fallback artwork, no invented music or lyrics.

The current backend limits catalog responses to 20 songs. It supplies no duration metadata (duration is measured for the current track), artwork, lyrics, album listing, playlist persistence or profile reads/edits. See [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md) for endpoint contracts and known backend constraints.

## Manual integration checks

With a working MongoDB/ImageKit configuration: register listener and artist accounts; logout/login; upload an audio file as artist; play its returned URL; seek/pause/switch tracks; check queue and repeat/shuffle; save likes and playlists and reload; filter catalog; create an album from owned songs. Check mobile navigation and player drawer, keyboard controls, reduced-motion preference, server-offline retry and unavailable audio. Register/upload/create-album write real backend records only on explicit submission.
