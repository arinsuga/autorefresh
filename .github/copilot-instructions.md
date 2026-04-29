# FlexCozAPI - AI Coding Agent Instructions

This is a multi-service Laravel 5.8 API backend for the FlexCoz cost management system with two primary services: **AuthAPI** (Single Sign-On) and **AppAPI** (Core Application).

## Architecture Overview

**Multi-service structure:**
- `authapi/` - Standalone Laravel app handling JWT-based authentication & SSO
- `appapi/` - Core Laravel app for cost management features (Absen/attendance, Users, Projects)
- Both services share the same MariaDB instance but separate databases (`DB_DATABASE` vs `DB_DATABASE_APPAPI`)
- **Routing tiers:** Each app has multiple route files (`api.php`, `bo.php` for backend, `fo.php` for frontend, `a0.php` for admin)

**Service boundaries:**
- AuthAPI: JWT token generation/validation, user registration/login, role-based auth
- AppAPI: All business logic (Absen/attendance tracking, user management, cost tracking)
- Nginx reverse proxy routes `/authapi/*` → authapi container, `/appapi/*` → appapi container
- Services communicate via HTTP with JWT tokens for inter-service calls

## Namespace & Code Organization

**PSR-4 namespaces (defined in `composer.json`):**
- `App\\` → `app/` (Models like `User`, `Project`, `Role`)
- `Arins\\` → `arins/` (Custom business logic layer)

**Key `arins/` structure:**
- `Services/` - Domain logic (Converter, Formatter, Locator, Response helpers)
- `Repositories/` - Data access layer
- `Bo/` & `Fo/` - Backend/Frontend specific logic (controllers, models, repos)
- `Facades/`, `Helpers/`, `Providers/` - Shared utilities
- `Http/` - Custom HTTP middleware & classes (including JWT auth: `authjwt`)

**Controllers organization:**
- `app/Http/Controllers/Auth/` - JWT authentication (login, register, refresh)
- `app/Http/Controllers/Absen/` - Attendance check-in/out
- `arins/Bo/Http/` - Backend operation controllers
- `arins/Fo/` - Frontend models/repos for public-facing features

## Development Workflows

**Setup & initialization:**
```bash
./dockerdev.sh run_build   # Build all images (AuthAPI, AppAPI, Nginx, MariaDB)
./dockerdev.sh run_up      # Start containers
php artisan migrate         # Run migrations in each service
```

**Clear caches (when adding routes/config):**
```bash
./appapi/devrefresh.sh  # Clears optimize, cache, config, view, route caches
```

**Testing:**
- Test suite configured in `phpunit.xml` for `tests/Converter` only
- Run tests: `php artisan test` or `vendor/bin/phpunit`

**Asset compilation (Laravel Mix):**
- `npm run dev` - Build assets in development
- `npm run prod` - Build & minify for production
- `npm run watch` - Watch for changes (local dev)
- Assets compiled to `public/css/` and `public/js/`

**Database management:**
- MariaDB container mounts custom image `sugaprivate/mariadb:latest`
- Run migrations: `php artisan migrate`
- Seed data: `php artisan db:seed` (configure seeders in `database/seeds/`)

## Authentication & JWT Pattern

**JWT implementation (Tymon/jwt-auth):**
- Configured in `config/jwt.php`
- Middleware `authjwt` protects routes (see `AuthController.__construct()`)
- Token format: Bearer token in `Authorization` header
- Login returns: `{ user, token }` with user roles attached
- Tokens refreshed via `/auth/refresh` endpoint

**Auth routes (appapi):**
- `POST /auth/register` - New user signup
- `POST /auth/login` - Login returns JWT + user with roles
- `POST /auth/refresh` - Refresh expired token
- `DELETE /auth/blacklist` - Logout (JWT blacklist)
- `GET /auth/me` - Current authenticated user

## Project-Specific Patterns & Conventions

**Route organization by tier:**
- `routes/api.php` - Public/JWT-protected API endpoints
- `routes/bo.php` - Backend/admin operations (prefixed `bo/*`)
- `routes/fo.php` - Frontend operations (not yet visible)
- `routes/a0.php` - Admin operations
- `routes/main.php` - Miscellaneous (e.g., SOS resource)

**Response handling:**
- Custom `Response/` service classes in `arins/Services/Response/` standardize API responses
- Controllers should use these formatters for consistency (JSON structure, status codes)

**Role-based access:**
- User model has `roles()` relationship (see `app/User.php`)
- Roles attached during login response (`$userRoles` in `AuthController.login()`)
- Use role data in frontend/backend to gate features

**Naming patterns:**
- Database table names: singular (`users`, `roles`, `projects`)
- Model classes: singular & capitalized (`User`, `Project`, `Role`)
- Controller classes: suffix with `Controller` (e.g., `AbsenController`)
- Service classes: domain name + specific function (e.g., `Converter`, `Formatter`)

## Environment & Configuration

**Config files to know:**
- `.env` - All environment variables (see `.env_appapi`, `.env_authapi` in compose files)
- `config/app.php` - App name, timezone, locale, providers
- `config/database.php` - DB connection (Laravel 5.8 defaults to `mysql`)
- `config/jwt.php` - JWT secret, algo, TTL

**Required .env variables:**
- `APP_ENV`, `APP_URL`, `APP_KEY`, `APP_DEBUG`
- `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (separate credentials per service)
- `JWT_SECRET` - Generated via `php artisan jwt:secret`

**Docker environment injection:**
- Docker Compose passes `.env` values to containers (see `docker-compose-dev.yml` services)
- Each service gets mounted `.env_appapi` / `.env_authapi` inside container

## Deployment & Infrastructure

**Kubernetes ready:**
- K8s manifests in `k8s/` directory (app-deployment.yml, db-statefulset.yml, etc.)
- Image tags: `sugaprivate/appapidev:latest`, `sugaprivate/authdev:latest`

**Docker image dependencies:**
- Custom PHP images with Laravel pre-installed (built from Dockerfile referenced in compose)
- MariaDB custom image: `sugaprivate/mariadb:latest`
- Nginx custom image: `sugaprivate/nginx-compose:latest`

## Common Tasks

**Add a new API endpoint:**
1. Define route in `routes/api.php` or tier-specific route file
2. Create controller in `app/Http/Controllers/` or `arins/Bo/Http/`
3. For business logic, use `arins/Services/` and `arins/Repositories/`
4. Run `./appapi/devrefresh.sh` to clear route cache
5. Protect with JWT: add `authjwt` middleware if needed

**Add a database table:**
1. Create migration: `php artisan make:migration create_table_name`
2. Define table in migration file
3. Create model: `php artisan make:model ModelName`
4. Run migration: `php artisan migrate`

**Debug JWT issues:**
- Check `config/jwt.php` for algorithm & TTL settings
- Verify `JWT_SECRET` is set in `.env` and non-empty
- Check `Authorization: Bearer <token>` header format in requests
- Log token validation in `AuthController` middleware

**Check service health:**
```bash
curl http://localhost/auth/status  # AuthAPI health check
curl http://localhost/appapi/*     # Route requests through Nginx
```

---

This codebase prioritizes **multi-service architecture, JWT authentication, and repository/service layer separation**. When adding features, follow the Arins namespace structure and respect service boundaries.
