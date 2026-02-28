# API Reference

## Route Structure

- Base URL: `/api/v1`
- Auth routes: `/api/v1/auth/*` (public)
- Protected routes: `/api/v1/*` (require Bearer token)
- Admin routes: `/api/v1/admin/*` (require admin role)

## Authentication Flow

1. Login: `POST /auth/login` → returns `{ accessToken, refreshToken }`
2. Refresh: `POST /auth/refresh` with `{ refreshToken }` → new token pair
3. Logout: `POST /auth/logout` → invalidates refresh token in Redis

- Access token: JWT, 15min expiry, contains `{ userId, role }`
- Refresh token: opaque UUID, 7d expiry, stored in Redis

## Middleware Stack (order matters)

1. `cors` — configured per environment
2. `helmet` — security headers
3. `rateLimit` — 100 req/min per IP (configurable via `RATE_LIMIT_MAX`)
4. `authMiddleware` — validates JWT, attaches `req.user`
5. `roleMiddleware(roles)` — checks `req.user.role` against allowed roles

## Error Handling

- All errors return `{ error: string, code: string, details?: object }`
- Error codes: `AUTH_INVALID`, `AUTH_EXPIRED`, `NOT_FOUND`, `VALIDATION`, `INTERNAL`
- Validation errors include `details` with field-level messages
- Unhandled errors caught by global error handler, logged to CloudWatch

## Key Gotchas

- `authMiddleware` must come BEFORE `roleMiddleware` — role check depends on `req.user`
- Rate limiter uses Redis in prod but in-memory in dev — rate limits reset on dev server restart
- File upload routes (`/api/v1/upload/*`) bypass JSON body parser — use `multer` middleware
