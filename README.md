# Tourism Service Web

A full-stack tourism booking web application built with Node.js and Express. It provides a public-facing site for browsing and booking tours, and a protected admin panel for managing all content.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB Atlas (Mongoose) |
| View Engine | Pug (server-side rendering) |
| Authentication | JWT stored in cookies |
| Image Upload | Multer + Cloudinary |
| Validation | Joi |
| Email | Nodemailer |
| Slug generation | mongoose-slug-updater |

## Features

### Client (Public)
- Browse featured tours on the homepage
- Filter and search tours by category, price range, keyword, and departure city
- View tour detail with full schedule, locations, and pricing (adult / children / baby)
- Add tours to cart and place orders
- Multiple payment methods: Cash, Bank Transfer, VNPay, ZaloPay

### Admin Panel (`/admin`)
- JWT-protected with role-based access control (RBAC)
- **Tours** — create, edit, soft-delete, restore from trash, permanently delete
- **Categories** — hierarchical category tree management
- **Orders** — view and update order/payment status
- **Users** — manage registered customer accounts
- **Settings** — manage admin accounts, roles & permissions, and website info
- **Profile** — update personal info and change password
- **Forgot password** — OTP-based reset via email

## Project Structure

```
tourism-app/
├── configs/          # Database connection and shared constants
├── controllers/
│   ├── admin/        # Admin panel controllers
│   └── client/       # Public site controllers
├── helpers/          # Utility functions (category tree, mail, Cloudinary, OTP)
├── middlewares/
│   ├── admin/        # JWT auth middleware
│   └── client/       # Website info, category, city middlewares
├── models/           # Mongoose schemas (Tour, Order, User, Role, etc.)
├── public/
│   ├── admin/        # Admin static assets (CSS, JS, images)
│   └── client/       # Client static assets (CSS, JS, images)
├── routers/
│   ├── admin/        # Admin routes
│   └── client/       # Client routes
├── seeds/            # Database seed scripts
├── validates/        # Joi validation schemas
├── views/
│   ├── admin/        # Admin Pug templates
│   └── client/       # Client Pug templates
└── index.js          # App entry point
```

## Getting Started

### Prerequisites

- Node.js >= 18
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A [Cloudinary](https://cloudinary.com/) account
- An email account for Nodemailer (e.g. Gmail App Password)

### Installation

```bash
git clone https://github.com/leviethoanganh/Tourism-Service-Web.git
cd Tourism-Service-Web
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE=<MongoDB Atlas connection string>
JWT_SECRET=<your JWT secret>
EMAIL_USERNAME=<sender email address>
EMAIL_PASSWORD=<sender email password or app password>
CLOUDINARY_NAME=<your Cloudinary cloud name>
CLOUDINARY_API_KEY=<your Cloudinary API key>
CLOUDINARY_API_SECRET=<your Cloudinary API secret>
```

> **Never commit the `.env` file.** It is already listed in `.gitignore`.

### Run

```bash
npm start
```

The server starts on [http://localhost:3000](http://localhost:3000).
The admin panel is available at [http://localhost:3000/admin](http://localhost:3000/admin).

## Admin Permissions

The RBAC system supports the following granular permissions:

| Permission | Value |
|---|---|
| View Dashboard | `dashboard-view` |
| View / Create / Edit / Delete Category | `category-view` / `category-create` / `category-edit` / `category-delete` |
| View / Create / Edit / Delete Tour | `tour-view` / `tour-create` / `tour-edit` / `tour-delete` |
| Tour Trash (restore / destroy) | `tour-trash` |

## Order Statuses

| Field | Values |
|---|---|
| Order status | `initial` (Pending) / `done` (Completed) / `cancel` (Cancelled) |
| Payment status | `unpaid` / `paid` |
| Payment methods | `money` / `bank` / `vnpay` / `zalopay` |

## Contact

**Author:** Le Viet Hoang Anh  
**Email:** leviethoanganh0912200@gmail.com  
**GitHub:** [leviethoanganh](https://github.com/leviethoanganh)
