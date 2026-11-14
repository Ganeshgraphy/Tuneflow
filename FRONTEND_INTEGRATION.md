# TuneFlow frontend integration

Backend inspected: all routes, controllers, middleware, models, storage, database startup and package configuration. The original backend is unchanged.

| Endpoint | Request | Response / access |
|---|---|---|
| POST /api/auth/register | JSON username, email, password, role (user or artist) | 201 message, user; sets token cookie; 409 duplicates |
| POST /api/auth/login | JSON email or username, password | 200 message, user; sets token cookie; 401 invalid credentials |
| POST /api/auth/logout | none | 200 message; clears cookie |
| GET /api/music/ | none | 200 message, musics array; public; first 20, no pagination parameters |
| POST /api/music/upload | multipart title and music file | artist cookie required; 201 music {id,uri,title,artist} |
| POST /api/music/album | JSON title, musics (song IDs) | artist cookie required; 201 album {id,title,artist,musics} |

Songs have _id, title, uri, artist; artist is populated with _id, username, email in catalog. User has username, email, bcrypt password hash, role. Albums reference songs and an artist. ImageKit stores uploaded audio in SPOTIFY/music and returns a direct URL. There is no cover artwork, duration, lyrics, play count, artist portrait, album listing or streaming proxy. HTML5 Audio plays the returned uri directly and discovers duration on metadata load. Decorative artwork is clearly an abstract fallback.

Axios uses credentials and cookie authentication, never bearer tokens. Vite proxies /api to port 3000 because the backend has no CORS middleware. Production requires a same-origin reverse proxy for /api; Vite preview does not proxy. An absolute cross-origin API URL requires backend CORS/cookie configuration by the operator. No secrets belong in VITE variables.

No profile/session read endpoint exists. Login profile is kept in memory and users sign in again after reload. Only id, username, email and role are retained; backend currently includes password hashes in auth responses. Cookies are not marked HttpOnly, Secure or SameSite by backend code; hardening is recommended before public deployment. JWT has no expiry configured. Unused authUser middleware has a role condition that always rejects. Album artist ref is `user`, while the registered model is `User`; album population would fail. These are documented, not silently changed.

Search and artist pages derive from the loaded 20-song catalog, not a global search API. Liked songs and create/rename/delete playlists are browser-local via localStorage, visibly labeled and not account-synced. Playlist IDs store references to catalog songs; unavailable songs are omitted. No fabricated songs or personalized/trending claims. Charts, radio, AI playlists, notifications, lyrics, album browsing and profile edits show explicit unavailable states. Artist studio integrates the two verified write endpoints. No automatic uploads or account changes occur.

One shared Audio instance and Zustand store drive the persistent player, queue and now-playing panel. TanStack Query manages catalog requests and invalidation after upload. Audio host availability, browser codec support and backend/database configuration determine end-to-end availability.
