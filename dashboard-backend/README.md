# Car Detailing Dashboard Backend

Backend API for the Car Detailing Workshop Dashboard.

## Features

- 🔐 Authentication & Role-Based Access (Admin, Accountant, Staff)
- 📊 Dashboard Overview
- 👥 Customer Management
- 📋 Booking Management
- 💼 Job/Service Management
- 🧾 Billing & Invoicing
- 📦 Inventory Management
- 👨‍🔧 Staff Management
- 📊 Financial Dashboard

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Validation**: Built-in Sequelize validation

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE car_detailing_db;
```

2. Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=car_detailing_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=car_detailing_jwt_secret_key_2024
JWT_EXPIRES_IN=24h

# File Upload
UPLOAD_PATH=./src/uploads
MAX_FILE_SIZE=5242880

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001
```

### 3. Run the Application

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/change-password` - Change password (protected)
- `POST /api/auth/logout` - User logout (protected)

### Health Check
- `GET /health` - API health check

## Default Users

The application creates default users on first run:

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| Admin | admin | admin123 | Full access |
| Accountant | accountant | accountant123 | Financial + Staff |
| Staff | staff | staff123 | Basic operations |

## Project Structure

```
src/
├── config/          # Database and app configuration
├── controllers/     # Request handlers
├── middleware/      # Custom middleware (auth, validation)
├── models/          # Sequelize models
├── routes/          # API route definitions
├── utils/           # Utility functions and seeders
├── uploads/         # File upload directory
└── index.ts         # Main server file
```

## Development

- The server runs on port 5000 by default
- Database tables are automatically created on first run
- Default users are seeded automatically in development mode
- CORS is configured for the frontend (localhost:3001)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | car_detailing_db |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | your_password |
| JWT_SECRET | JWT signing secret | fallback_secret |
| JWT_EXPIRES_IN | JWT expiration | 24h |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3001 | 