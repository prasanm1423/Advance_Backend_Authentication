# Advanced Backend Authentication API 🚀

An enterprise-ready, highly secure RESTful authentication and user management API built with **Node.js**, **Express 5**, **TypeScript**, and **MongoDB (Mongoose)**. 

This project implements modern security standards including **JWT Access & Refresh Tokens**, **HTTP-Only Cookies**, **Token Versioning (Instant Session Invalidation)**, **Bcrypt Password Hashing**, **Zod Input Schema Validation**, **Nodemailer Email Verification**, and **Role-Based Access Control (RBAC)**.

---

## 🌟 Key Features

- 🔐 **Secure Registration & Login**: User onboarding with bcrypt password hashing (12 salt rounds) and Zod payload validation.
- ✉️ **Email Verification System**: Account activation via secure email links powered by Nodemailer.
- 🔑 **Dual Token Authentication**: Short-lived Access Tokens (`30m`) paired with long-lived Refresh Tokens (`10d`).
- 🍪 **HTTP-Only Cookie Storage**: Refresh tokens stored securely in `httpOnly`, `sameSite: lax` cookies to prevent XSS attacks.
- 🔄 **Token Versioning**: Instantly invalidates all active tokens across devices whenever a user resets their password or updates security credentials.
- 🔑 **Password Reset Flow**: Secure token-based password reset via email using SHA-256 hashed one-time tokens with expiration timer (15 minutes).
- 🛡️ **Role-Based Access Control (RBAC)**: Enforced route-level protection (`requireAuth` & `requireRole`) supporting `user` and `admin` roles.
- 🩺 **Health Monitoring**: Dedicated health check endpoint for monitoring uptime.
- ⚡ **TypeScript & Express 5**: Modern ESModule codebase with full type safety and developer watch mode using `tsx`.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Runtime Engine** | [Node.js](https://nodejs.org/) (ES Modules) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Web Framework** | [Express 5](https://expressjs.com/) |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/) / [Mongoose 9](https://mongoosejs.com/) |
| **Validation** | [Zod 4](https://zod.dev/) |
| **Authentication** | [JSONWebToken (jsonwebtoken)](https://jwt.io/) |
| **Security & Hashing** | [bcrypt](https://github.com/kelektiv/node.bcrypt.js) & Node.js `crypto` |
| **Email Delivery** | [Nodemailer 9](https://nodemailer.com/) |
| **Development Tools** | [tsx](https://github.com/privatenumber/tsx) (Dev Server Watcher) |

---

## 📁 Project Architecture & File Structure

```
Advance_Auth/
├── src/
│   ├── config/
│   │   └── db.ts                # MongoDB connection handler
│   ├── controllers/
│   │   └── auth/
│   │       ├── auth.controller.ts # Auth business logic (register, login, refresh, reset, etc.)
│   │       └── auth.schema.ts     # Zod validation schemas for registration & login
│   ├── lib/
│   │   ├── email.ts             # Nodemailer transport & mail sending helper
│   │   ├── hash.ts              # Bcrypt password hashing & verification utilities
│   │   └── token.ts              # Access & Refresh JWT generation and verification
│   ├── middleware/
│   │   ├── requireAuth.ts       # JWT authentication & token version validator
│   │   └── requireRole.ts       # Role-based access control (RBAC) middleware
│   ├── models/
│   │   └── user.model.ts        # Mongoose User schema & data model
│   ├── routes/
│   │   ├── admin.routes.ts      # Protected admin endpoints
│   │   ├── auth.routes.ts       # Authentication routes (/auth)
│   │   └── user.routes.ts       # Protected user endpoints (/user)
│   ├── app.ts                   # Express application setup & middleware registration
│   └── server.ts                # HTTP Server entry point & DB bootstrap
├── .env                         # Environment variables (git-ignored)
├── .gitignore                   # Ignored files list
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

---

## 🗄️ Database Schema

### **User Collection (`users`)**

```typescript
{
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // Bcrypt hash
  name: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isEmailVerified: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, default: undefined },
  tokenVersion: { type: Number, default: 0 }, // Used for global token revocation
  resetPassToke: { type: String, default: undefined }, // SHA-256 hashed reset token
  resetPassExpiry: { type: Date, default: undefined }, // Token expiration timestamp
  createdAt: { type: Date },
  updatedAt: { type: Date }
}
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and configure the following parameters:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
APP_URL=http://localhost:5000

# Database
MONGO_URI=mongodb://localhost:27017/advance_auth

# JWT Security
JWT_ACCESS_SECRET=your_super_secret_jwt_key_here

# SMTP / Email Configuration
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM="Advance Auth" <no-reply@example.com>
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** instance (local server or MongoDB Atlas)
- **NPM** or **Yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/prasanm1423/Advance_Backend_Authentication.git
   cd Advance_Backend_Authentication
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` (or create `.env`) and populate the environment variables as shown above.

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The server will start listening at `http://localhost:5000`.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📡 API Reference & Endpoints

### 🩺 **Health Check**

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | Returns system health status |

---

### 🔓 **Authentication Routes (`/auth`)**

#### 1. Register User
- **Endpoint**: `POST /auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "John Doe"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "message": "User Registered",
    "user": {
      "id": "66b1a2c34f5e6d7a8b9c0d1e",
      "email": "user@example.com",
      "role": "user",
      "isEmailVerified": false
    }
  }
  ```

#### 2. Verify Email
- **Endpoint**: `GET /auth/verify-email?token=<verification_token>`
- **Access**: Public (via email link)
- **Response** (`200 OK`):
  ```json
  {
    "message": "Email is Verified. You can login"
  }
  ```

#### 3. Login
- **Endpoint**: `POST /auth/login`
- **Access**: Public (Email must be verified)
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response Header**: Sets `refreshToken` HTTP-Only cookie.
- **Response Payload** (`200 OK`):
  ```json
  {
    "message": "Login is Successfull",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "66b1a2c34f5e6d7a8b9c0d1e",
      "email": "user@example.com",
      "role": "user",
      "isEmailVerified": true,
      "twoFactorEnabled": false
    }
  }
  ```

#### 4. Refresh Access Token
- **Endpoint**: `POST /auth/refresh`
- **Access**: Public (Requires `refreshToken` cookie)
- **Response Payload** (`200 OK`):
  ```json
  {
    "message": "Token Refreshed",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
  ```

#### 5. Forgot Password
- **Endpoint**: `POST /auth/forgot-password`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response** (`200 OK`): Sends a password reset URL to user's email address.

#### 6. Reset Password
- **Endpoint**: `POST /auth/reset-password`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "token": "<raw_reset_token_from_email>",
    "password": "newSecurePassword123"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "message": "Password changes successfully"
  }
  ```

#### 7. Logout
- **Endpoint**: `POST /auth/logout`
- **Access**: Public
- **Response** (`200 OK`): Clears `refreshToken` HTTP-Only cookie.

---

### 👤 **User Routes (`/user`)**

#### Get User Profile
- **Endpoint**: `GET /user/me`
- **Access**: Private (`Authorization: Bearer <accessToken>`)
- **Response** (`200 OK`):
  ```json
  {
    "user": {
      "id": "66b1a2c34f5e6d7a8b9c0d1e",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "isEmailVerified": true
    }
  }
  ```

---

### 🛡️ **Admin Routes (`/admin`)**

#### List All Registered Users
- **Endpoint**: `GET /admin/users`
- **Access**: Private (`Admin` role required)
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response** (`200 OK`):
  ```json
  {
    "users": [
      {
        "id": "66b1a2c34f5e6d7a8b9c0d1e",
        "email": "user@example.com",
        "role": "user",
        "isEmailVerified": true,
        "createdAt": "2026-08-09T04:49:51.000Z"
      }
    ]
  }
  ```

---

## 🔒 Security Best Practices Implemented

1. **Password Hashing**: Passwords are never stored in plain text. They are hashed using `bcrypt` with a salt factor of 12 before persistence.
2. **HTTP-Only Cookies**: Refresh tokens are served via `httpOnly` cookies, shielding them from client-side script access and DOM/XSS vulnerabilities.
3. **Token Versioning Mechanism**: `tokenVersion` counter is embedded in JWT payloads. Incrementing this counter instantly invalidates all active access and refresh tokens issued across all devices (e.g. upon password reset).
4. **Input Sanitization & Schema Validation**: Endpoint parameters are rigorously validated using `Zod` schemas before processing.
5. **Secure Token Reset**: Password reset tokens are generated using cryptographically secure random bytes (`crypto.randomBytes`) and stored in the database as SHA-256 hashes with a strict 15-minute expiration window.

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).
