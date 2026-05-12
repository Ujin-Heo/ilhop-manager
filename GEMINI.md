# Project Information & Development Guidelines

## 1. Project Overview & Tech Stack
- **Frontend**: Next.js (App Router, v16+), Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy 2.0+ (Async)
- **Database**: PostgreSQL
- **Infrastructure**: Vercel (Frontend), Railway (Backend & Database)

## 2. Documentation Mandates
- **Keep Docs Updated**: Every time you change a database structure (models, migrations) or an API endpoint (routes, schemas), you MUST update:
  - `docs/DB_schema.sql` (Database schema)
  - `docs/OpenAPI.yaml` (REST API specification)
  - `docs/AsyncAPI.yaml` (WebSocket/Async API specification)

## 3. Development Rules

### Backend & Database
- **Dependency Management**: Use `uv` (FastAPI).
- **Typing**: Use latest Python typing conventions (e.g., `Mapped[list[str] | None]` instead of `Mapped[Optional[List[str]]]`).
- **Migrations**: Use Alembic for all database schema changes.
- **API Design**: Follow RESTful conventions.

### Frontend (Next.js v16+)
- **Proxy over Middleware**: The standard `middleware.ts` convention is deprecated and renamed to `proxy.ts`.
  - Always use `proxy.ts` (or `proxy.js`) in the `frontend/` root.
  - The interceptor function must be named `proxy` (e.g., `export function proxy(request: NextRequest)`).
- **Styling & Colors**:
  - Do NOT use standard Tailwind color utilities (e.g., `text-gray-500`).
  - Use color variables defined in `@theme inline` section of `frontend/components/globals.css`.
  - Use descriptive names (e.g., `--color-white`) and `oklch` format for new colors.

## 4. Infrastructure & Security
- **Cross-Domain Cookies (Production)**: When frontend (Vercel) and backend (Railway) are on different domains, browsers block third-party cookies by default.
- **Solution (Next.js Rewrite)**:
  - **Proxy Configuration**: Use `async rewrites()` in `next.config.ts` to map `/api/:path*` to the backend URL. This makes cookies "first-party".
  - **Base URL Strategy**:
    - **Client-side**: Use `'/api'` (relative path) to trigger the Next.js rewrite.
    - **Server-side**: Use the full backend URL (e.g., `process.env.NEXT_PUBLIC_API_URL`) as rewrites don't apply to server-side `fetch`.
- **Cookie Attributes**: Authentication cookies (e.g., `admin_session`) MUST use `samesite="none"` and `secure=True`.
- **Environment Variables**: Sensitive keys like `SECRET_KEY` must be managed via environment variables (Railway/`.env`) and never hardcoded.
