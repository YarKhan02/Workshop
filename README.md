# Car Detailing Workshop Management System

A full-stack web application for managing a car detailing workshop, built with React frontend and Node.js/Express backend.

## 🚗 Features

### Customer Management
- Add, edit, view, and delete customers
- Customer search and filtering
- Customer details with contact information
- Customer booking history

### Car Management
- Add, edit, view, and delete cars
- Associate cars with customers
- Car search and filtering
- Vehicle information tracking (make, model, year, VIN, etc.)

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/Staff)
- Protected routes and API endpoints

### User Interface
- Modern, responsive design with Tailwind CSS
- Real-time data updates with React Query
- Modal forms for data entry
- Pagination for large datasets
- Search and filtering capabilities

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **React Query** for data fetching and caching
- **React Hook Form** with Zod validation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Sequelize ORM** with SQLite database
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

## 📁 Project Structure

```
Car/
├── dashboard/                 # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   └── package.json
├── dashboard-backend/        # Backend Node.js application
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   └── config/          # Configuration files
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Car
   ```

2. **Install backend dependencies**
   ```bash
   cd dashboard-backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../dashboard
   npm install
   ```

4. **Set up environment variables**

   Create `.env` file in `dashboard-backend/`:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```

   Create `.env` file in `dashboard/`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the backend server**
   ```bash
   cd dashboard-backend
   npm run dev
   ```

6. **Start the frontend development server**
   ```bash
   cd dashboard
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5000

## 🔐 Default Admin Account

The system comes with a default admin account:
- **Username**: admin
- **Password**: admin123

**Important**: Change these credentials in production!

## 📊 Database

The application uses SQLite as the database, which is automatically created when you first run the backend. The database file will be created in the `dashboard-backend/` directory.

## 🔧 Available Scripts

### Backend (`dashboard-backend/`)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Frontend (`dashboard/`)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Customers
- `GET /api/customers` - Get all customers (with pagination)
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Cars
- `GET /api/cars` - Get all cars (with pagination)
- `POST /api/cars` - Create new car
- `GET /api/cars/:id` - Get car by ID
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car
- `GET /api/cars/customer/:customerId` - Get cars by customer

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS protection
- SQL injection prevention (Sequelize ORM)

## 🎨 UI/UX Features

- Responsive design for all screen sizes
- Dark/light mode support
- Loading states and error handling
- Toast notifications for user feedback
- Modal dialogs for data entry
- Search and filtering capabilities
- Pagination for large datasets

## 🚀 Deployment

### Backend Deployment
1. Build the backend: `npm run build`
2. Set production environment variables
3. Deploy to your preferred hosting service (Heroku, Railway, etc.)

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your preferred hosting service (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ for car detailing workshops**
