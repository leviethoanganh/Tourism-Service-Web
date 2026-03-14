# 🌍 Tourism Service Management App

A robust Full-Stack web application designed to streamline tourism service management. Built with the **MVC (Model-View-Controller)** architecture, this platform provides a seamless experience for managing tours, user authentications, and integrated travel services.

---

## 🚀 Key Features

* **User Authentication:** Secure Sign-up and Login using **JWT (JSON Web Tokens)** and **bcrypt** for password hashing.
* **Tour Management:** Full CRUD operations for tour packages, including categories, pricing, and descriptions.
* **Media Management:** Optimized image uploads and storage integration via **Cloudinary API**.
* **Email Services:** Automated notifications and password resets powered by **Nodemailer**.
* **Security:** Middleware-based authorization to protect sensitive routes and administrative actions.
* **Data Validation:** Strict server-side validation for all incoming data to ensure system integrity.

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose ODM
* **View Engine:** Pug / EJS (Template Engine)
* **Authentication:** Passport.js / JWT
* **Infrastructure:** Cloudinary (Images), MongoDB Atlas (Cloud Database)
* **Package Manager:** Yarn / NPM

---

## 📂 Project Structure

```text
├── configs/        # System configurations (DB, Cloudinary, etc.)
├── controllers/    # Business logic & request handling
├── helpers/        # Utility functions (Slug generators, formatters)
├── middlewares/    # Authentication & Permission guards
├── models/         # MongoDB Schemas & Data models
├── public/         # Static assets (CSS, Client-side JS, Images)
├── routers/        # API and Web route definitions
├── validates/      # Input validation logic
├── views/          # Front-end templates


⚙️ Installation & Setup Guide
Follow these steps to get your local development environment running:

1. Clone the Project
Open your terminal (PowerShell/CMD) and run:

PowerShell
git clone [https://github.com/leviethoanganh/Tourism-Service-App.git](https://github.com/leviethoanganh/Tourism-Service-App.git)
cd "tourism app"
2. Install Dependencies
Ensure you have Yarn installed, then run:

PowerShell
yarn install
3. Environment Configuration
Create a file named .env in the root directory and add the following configurations (Replace with your actual credentials):

Đoạn mã
PORT=3000
DATABASE=your_mongodb_connection_string
JWT_SECRET=YOUR_SECRET_KEY
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
4. Launch the Application
Start the server in development mode:

PowerShell
# This will run the start script defined in your package.json
yarn start
Once started, open your browser and navigate to: http://localhost:3000

📧 Contact & Support
Author: Le Viet Hoang Anh

Email: leviethoanganh0912200@gmail.com

GitHub: leviethoanganh
cd "tourism app"
├── .env            # Environment variables (Hidden)
└── index.js        # Application entry point
