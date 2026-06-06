# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start the development server (with nodemon + inspector)
npm start
# Runs: npx nodemon --inspect index.js on port 3000
```

There are no test or lint scripts configured.

## Architecture

This is a **Node.js / Express** tourism booking application using:
- **MongoDB Atlas** (Mongoose) for data — connection string from `DATABASE` env var
- **Pug** for server-side rendering (`views/`)
- **JWT** (stored in cookies) for admin authentication
- **Cloudinary** for image uploads
- **Joi** for request validation
- **Nodemailer** for emails

### Dual-surface MVC structure

The app has two completely separate surfaces mounted in `index.js`:

| Surface | Mount path | Router entry |
|---------|-----------|--------------|
| Client (public) | `/` | `routers/client/index.route.js` |
| Admin | `/<pathAdmin>` (`/admin`) | `routers/admin/index.router.js` |

Each surface has its own `controllers/`, `routers/`, `middlewares/`, and `views/` subdirectory (`admin/` and `client/`).

### Admin auth flow

All admin routes (except `/admin/account`) are protected by `middlewares/admin/auth.middleware.js`. It reads the `token` cookie, verifies it with `JWT_SECRET`, queries `AccountAdmin` from the DB, then loads the account's `Role` (with its `permissions` array) into `res.locals.pers` and `req.pers` for permission checks downstream.

### Client shared middlewares

Applied globally to all client routes in `routers/client/index.route.js` before any route handler:
- `settingMiddleware.websiteInfo` — loads site settings (name, logo, etc.) into `res.locals`
- `categoryMiddleware.list` — loads active category tree into `res.locals`
- `cityMiddleware.list` — loads cities into `res.locals`

### Key models

| Model file | Collection | Purpose |
|---|---|---|
| `tour.model.js` | `tours` | Core tour data; auto-generates a slug from `name` via `mongoose-slug-updater` |
| `account.admin.model.js` | `accounts-admin` | Admin user accounts with role reference |
| `role.model.js` | `roles` | RBAC roles with `permissions` array |
| `category.model.js` | `categories` | Hierarchical (self-referencing `parent` field) |
| `order.model.js` | `orders` | Bookings; `items` is an array of cart entries |
| `city.model.js` | `cities` | Departure city options |

Soft-delete is used everywhere — models have a `deleted: Boolean` field; queries must always filter `deleted: false`.

### Shared config (`configs/variable.config.js`)

Exports constants used across the app:
- `pathAdmin` — the admin URL prefix (`"admin"`)
- `permissionList` — all available RBAC permissions (Vietnamese labels + slug values like `"tour-view"`)
- `paymentMethodList` / `paymentStatusList` / `statusList` — order status enums

### Helpers

- `helpers/category.helper.js` — `buildCategoryTree()` (recursive tree builder) and `getCategorySubId()` (recursive child ID collector for filtering tours by category)
- `helpers/cloudinary.helper.js` — Cloudinary upload config (used with `multer-storage-cloudinary`)
- `helpers/mail.helper.js` — Nodemailer helper for sending emails (e.g. forgot-password OTP)
- `helpers/generate.helper.js` — Generates random codes/OTPs

### Validation

`validates/admin/` contains Joi schemas used as Express middleware on write routes. They call `next()` on success or return an error response directly.

### Environment variables required

```
DATABASE          # MongoDB Atlas connection string
JWT_SECRET        # Secret for signing admin JWTs
EMAIL_USERNAME    # Nodemailer sender email
EMAIL_PASSWORD    # Nodemailer sender password
CLOUDINARY_NAME   # Cloudinary cloud name
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```
