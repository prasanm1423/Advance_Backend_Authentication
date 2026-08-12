# Advanced Backend Authentication API 🚀

A feature-rich, production-ready RESTful authentication and user management system built with **Node.js**, **Express 5**, **TypeScript**, and **MongoDB (Mongoose)**. 

This project incorporates modern web security standards including **Google OAuth 2.0**, **Dual JWT (Access & Refresh) Tokens**, **HTTP-Only Cookies**, **Token Versioning (Instant Multi-Device Revocation)**, **Bcrypt Hashing**, **Zod Input Schema Validation**, **Nodemailer Email Verification**, and **Role-Based Access Control (RBAC)**.

---

## 🌟 Key Features

- 🌐 **Google OAuth 2.0 Authentication**: Seamless social login flow with Google consent screens, ID token verification via `google-auth-library`, and automatic user account provision/verification.
- 🔐 **User Registration & Login**: Standard email/password onboarding with password hashing (`bcrypt` with 12 salt rounds) and Zod payload validation.
- ✉️ **Email Verification System**: Verification link sent upon registration powered by Nodemailer. Requires verification prior to password login.
- 🔑 **Dual Token Architecture**:
  - **Access Token**: Short-lived JWT (`30 minutes`) passed via `Authorization: Bearer <token>` header.
  - **Refresh Token**: Long-lived JWT (`10 days`) stored securely in an `httpOnly`, `sameSite: lax` cookie.
- 🔄 **Token Versioning (`tokenVersion`)**: In-database token version counter that invalidates all active sessions across all devices when a user resets their password.
- 🔑 **Password Reset Flow**: Cryptographically secure single-use token (`crypto.randomBytes(32)` stored as a SHA-256 hash) with a strict 15-minute expiration timer.
- 🛡️ **Role-Based Access Control (RBAC)**: Route protection via `requireAuth` and `requireRole("user" | "admin")` middlewares.
- 🩺 **Health Check**: Endpoint (`/health`) to monitor service uptime.
- ⚡ **TypeScript & Express 5**: Modern ESModule architecture (`"type": "module"`) with hot-reloading using `tsx`.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Runtime & Language** | [Node.js](https://nodejs.org/) (ES Modules) & [TypeScript 7](https://www.typescriptlang.org/) |
| **Framework** | [Express 5](https://expressjs.com/) |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/) & [Mongoose 9](https://mongoosejs.com/) |
| **Validation** | [Zod 4](https://zod.dev/) |
| **OAuth & Social Auth**| [google-auth-library 11](https://github.com/googleapis/google-api-nodejs-client) |
| **Authentication** | [jsonwebtoken 9](https://jwt.io/) & [cookie-parser 1.4](https://github.com/expressjs/cookie-parser) |
| **Security & Hashing** | [bcrypt 6](https://github.com/kelektiv/node.bcrypt.js) & Node.js `crypto` |
| **Email Transport** | [Nodemailer 9](https://nodemailer.com/) |
| **Dev Tooling** | [tsx 4](https://github.com/privatenumber/tsx) (Development Runner & Watcher) |

---

## 📁 Project Architecture & File Structure

```
Advance_Auth/
├── src/
│   ├── config/
│   │   └── db.ts                  # MongoDB connection setup
│   ├── controllers/
│   │   └── auth/
│   │       ├── auth.controller.ts # Handlers for register, login, Google OAuth, refresh, logout, reset
│   │       └── auth.schema.ts     # Zod validation schemas
│   ├── lib/
│   │   ├── email.ts               # Nodemailer transporter helper
│   │   ├── hash.ts                # Bcrypt hash and verification functions
│   │   └── token.ts               # Access & Refresh JWT generators and verifiers
│   ├── middleware/
│   │   ├── requireAuth.ts         # JWT authentication & token version verification
│   │   └── requireRole.ts         # Role-based access control middleware
│   ├── models/
│   │   └── user.model.ts          # Mongoose User schema definition
│   ├── routes/
│   │   ├── admin.routes.ts        # Admin endpoints (/admin)
│   │   ├── auth.routes.ts         # Authentication endpoints (/auth)
│   │   └── user.routes.ts         # User profile endpoints (/user)
│   ├── services/                  # Business logic services
│   ├── app.ts                     # Express app configuration & middleware
│   └── server.ts                  # HTTP Server bootstrapping & DB initialization
├── dist/                          # Compiled JavaScript build output (generated via npm run build)
├── .env                           # Local environment variables
├── .gitignore                     # Git ignore rules
├── package.json                   # NPM dependencies & scripts
├── tsconfig.json                  # TypeScript compiler settings
└── README.md                      # Documentation
```

---

## 🗄️ Database Schema (`User` Model)

The user document structure in MongoDB (`users` collection):

```typescript
{
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },               // Bcrypt hash (12 rounds)
  name: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isEmailVerified: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, default: undefined },
  tokenVersion: { type: Number, default: 0 },              // Incremented on password reset to invalidate tokens
  resetPassToke: { type: String, default: undefined },      // SHA-256 hash of password reset token
  resetPassExpiry: { type: Date, default: undefined },      // 15-minute expiration timestamp
  createdAt: { type: Date },                               // Auto-generated timestamp
  updatedAt: { type: Date }                                // Auto-generated timestamp
}
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root folder with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
APP_URL=http://localhost:5000

# Database Connection
MONGO_URI=mongodb://localhost:27017/advance_auth

# JWT Secret
JWT_ACCESS_SECRET=your_super_secret_jwt_key_here

# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback

# SMTP Email Configuration (Nodemailer)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM="Advance Auth" <no-reply@example.com>
```

---

## 🚀 Getting Started & Setup

### Prerequisites

- **Node.js**: `v18+`
- **MongoDB**: Local MongoDB instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI
- **Google Cloud Console Credentials**: OAuth 2.0 Client ID and Secret (for Google Login)

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/prasanm1423/Advance_Backend_Authentication.git
   cd Advance_Backend_Authentication
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file as shown in the section above.

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:5000`.

5. **Build & Run in Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📡 API Reference & Endpoints

### 🩺 **Health Check**

#### `GET /health`
- **Access**: Public
- **Response** (`200 OK`):
  ```json
  {
    "status": "ok"
  }
  ```

---

### 🔓 **Authentication Endpoints (`/auth`)**

#### 1. Start Google OAuth Login
- **Endpoint**: `GET /auth/google`
- **Access**: Public
- **Description**: Generates Google OAuth consent screen URL (`scopes`: `openid`, `email`, `profile`, `access_type`: `offline`) and redirects the user to Google Login.

#### 2. Google OAuth Callback
- **Endpoint**: `GET /auth/google/callback?code=<authorization_code>`
- **Access**: Public
- **Description**: Receives authorization code from Google, verifies the `id_token` via Google OAuth2Client, auto-creates/verifies the user account, issues JWT Access Token, sets `refreshToken` HTTP-Only cookie, and returns user payload.
- **Response Header**: Sets `refreshToken` HTTP-Only cookie.
- **Response Payload** (`200 OK`):
  ```json
  {
    "message": "Google login successfull",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "66b1a2c34f5e6d7a8b9c0d1e",
      "email": "user@gmail.com",
      "role": "user",
      "isEmailVerified": true
    }
  }
  ```

#### 3. Register User (Email / Password)
- **Endpoint**: `POST /auth/register`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
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

#### 4. Verify Email
- **Endpoint**: `GET /auth/verify-email?token=<verification_token>`
- **Access**: Public (Clicked via email)
- **Response** (`200 OK`):
  ```json
  {
    "message": "Email is Verified.You can login"
  }
  ```

#### 5. Login (Email / Password)
- **Endpoint**: `POST /auth/login`
- **Access**: Public (Requires verified email)
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response Header**: Sets `refreshToken` in `httpOnly` cookie (`maxAge`: 10 days).
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

#### 6. Refresh Access Token
- **Endpoint**: `POST /auth/refresh`
- **Access**: Public (Requires `refreshToken` cookie)
- **Response Payload** (`200 OK`):
  ```json
  {
    "message": "Token Refreshed",
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

#### 7. Forgot Password
- **Endpoint**: `POST /auth/forgot-password`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "message": "Email send if user exists"
  }
  ```

#### 8. Reset Password
- **Endpoint**: `POST /auth/reset-password`
- **Access**: Public
- **Body**:
  ```json
  {
    "token": "<raw_token_from_email>",
    "password": "newSecurePassword123"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "message": "Password changes successfully"
  }
  ```
- *Note*: Successfully resetting the password increments `tokenVersion`, invalidating all active sessions.

#### 9. Logout
- **Endpoint**: `POST /auth/logout`
- **Access**: Public
- **Response** (`200 OK`): Clears `refreshToken` cookie.
  ```json
  {
    "message": "User Logged Out Successfully"
  }
  ```

---

## 👤 **User Endpoints (`/user`)**

#### Get Authenticated User Profile
- **Endpoint**: `GET /user/me`
- **Access**: Protected (`Authorization: Bearer <accessToken>`)
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

## 🛡️ **Admin Endpoints (`/admin`)**

#### Fetch All Registered Users
- **Endpoint**: `GET /admin/users`
- **Access**: Protected (`Authorization: Bearer <accessToken>`, Admin role required)
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

## 🔒 Security Architecture Highlights

1. **Google OAuth 2.0 Verification**: Implements `google-auth-library` to exchange authorization codes and verify Google ID tokens (`ticket.getPayload()`), ensuring users authenticate securely via Google.
2. **Bcrypt Password Hashing**: Standard password logins are securely hashed with 12 salt rounds before database persistence.
3. **HTTP-Only Cookie Protection**: Refresh tokens are isolated inside HTTP-Only cookies to protect against Cross-Site Scripting (XSS).
4. **Session Revocation via `tokenVersion`**:
   - `tokenVersion` is encoded inside both Access and Refresh JWT payloads.
   - The `requireAuth` and `refreshHandler` middlewares compare the payload version against the live database record.
   - On password reset, `tokenVersion` is incremented by 1, instantly rendering all existing access and refresh tokens invalid across all devices.
5. **Secure Reset Token Hashing**: Password reset raw tokens are transmitted via email, but only SHA-256 cryptographic hashes are saved in MongoDB alongside a 15-minute expiry timestamp.
6. **Request Schema Validation**: All authentication routes sanitize and validate request bodies using Zod schemas (`registerSchema`, `loginSchema`).

---

## 📜 NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the server in watch mode using `tsx` |
| `npm run build` | Compiles TypeScript code to JavaScript inside `/dist` |
| `npm run start` | Runs compiled JavaScript server from `/dist/server.js` |

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
