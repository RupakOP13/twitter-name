# Twitter Clone

A full-stack Twitter clone application built with Node.js, Express, MongoDB, and React.

## Features

- 🔐 **Authentication & Authorization**
  - User signup and login
  - JWT-based authentication
  - Protected routes
  - Secure password hashing with bcrypt

- 👤 **User Management**
  - User profiles
  - Email and username validation

- 🔒 **Security**
  - HTTP-only cookies
  - Password encryption
  - Protected API routes

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie handling
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **cloudinary** - Image upload service

### Frontend
- React (coming soon)

## Project Structure

```
twitter/
├── backend/
│   ├── controllers/
│   │   └── auth.controller.js    # Authentication logic
│   ├── db/
│   │   └── connectMongoDB.js     # Database connection
│   ├── middlewares/
│   │   └── protectRoute.js       # Route protection middleware
│   ├── models/
│   │   └── user.models.js        # User schema
│   ├── routes/
│   │   └── auth.routes.js        # Authentication routes
│   ├── utils/
│   │   └── generateToken.js      # JWT token generation
│   ├── server.js                 # Server entry point
│   └── package.json
├── frontend/
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd twitter
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   PORT=5000
   ```

### Running the Application

**Development mode:**
```bash
# From the root directory
npm run dev

# Or run backend only
npm run dev:backend
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### Request Examples

**Signup**
```json
POST /api/auth/signup
{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login**
```json
POST /api/auth/login
{
  "username": "johndoe",
  "password": "password123"
}
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/twitter` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-here` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `5000` |

## Security Features

- Passwords are hashed using bcrypt before storage
- JWT tokens stored in HTTP-only cookies
- CORS enabled for cross-origin requests
- Protected routes require valid authentication
- Secure cookie settings in production

## Development

**Nodemon** is configured for automatic server restart on file changes during development.

## License

ISC

## Author

Your Name

---

Made with ❤️ using Node.js and Express