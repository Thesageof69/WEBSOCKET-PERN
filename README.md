# WEBSOCKET-PERN

A full-stack real-time chat application built with the PERN stack (PostgreSQL, Express, React, Node.js) and WebSockets via Socket.io.

## Tech Stack

**Backend**
- Node.js + Express
- PostgreSQL (via `pg`)
- Socket.io for real-time communication
- JWT authentication (`jsonwebtoken`)
- Password hashing with `bcryptjs`
- `cookie-parser`, `cors`, `dotenv`

**Frontend**
- React 19 (Create React App)
- `socket.io-client`
- `axios` for HTTP requests
- `react-router-dom` for routing

## Project Structure

```
WEBSOCKET-PERN/
├── front/                  # React frontend
│   └── src/                # Components and pages
├── public/                 # Static files served by Express
├── main.js                 # Express app entry point
├── socketServer.js         # Socket.io server setup
├── userRoutes.js           # API routes
├── userController.js       # User auth logic (register/login)
├── userModel.js            # User DB queries
├── messageController.js    # Message handling logic
├── messageModel.js         # Message DB queries
└── database.js             # PostgreSQL connection
```

## Features

- User registration and login with JWT (stored in cookies)
- Real-time messaging using Socket.io
- Online user tracking via an in-memory Map
- PostgreSQL for persistent message and user storage
- CORS-enabled for local and deployed frontend

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- npm

### Backend Setup

```bash
npm install
```

Create a `.env` file:
```
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd front
npm install
npm start
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:5000`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start server with Node |
| `npm run dev` | Start server with Nodemon (auto-reload) |

