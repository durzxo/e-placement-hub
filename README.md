# E-Placement Hub

A comprehensive placement management system designed for educational institutions to streamline the entire placement process for students, faculty, and administrators.

## 🚀 Features

### 🔐 Authentication System
- User registration and login
- Password recovery with OTP
- JWT-based secure authentication
- Protected routes and session management

### 📊 Dashboard & Analytics
- Real-time placement statistics
- Student progress tracking
- Drive management overview
- Interactive charts and visualizations

### 👥 Student Management
- Student profile management
- Placement activity tracking
- CGPA and contact information
- Round-by-round progress monitoring

### 🏢 Drive Management
- Recruitment drive creation
- Student registration tracking
- Multi-round assessment management
- Company integration

### 🎨 Modern UI/UX
- Responsive design for all devices
- Beautiful animations with Framer Motion
- Professional teal and blue color scheme
- Intuitive navigation

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern JavaScript library
- **Vite 7.1.2** - Fast build tool and dev server
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **Framer Motion 12.23.12** - Animation library
- **React Router DOM 7.8.2** - Declarative routing
- **Axios 1.11.0** - HTTP client
- **Chart.js 4.5.0** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web application framework
- **MongoDB** - NoSQL database
- **JWT 9.0.2** - JSON Web Tokens for authentication
- **bcryptjs 3.0.2** - Password hashing
- **multer 2.0.2** - File upload handling

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/durzxo/e-placement-hub.git
cd e-placement-hub
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with required environment variables
cp .env.example .env

# Edit .env file with your configuration:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASS=your_email_password
# PORT=5000

# Start the backend server
npm run dev
```

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

### 4. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 📁 Project Structure

```
e-placement-hub/
├── backend/
│   ├── index.js                 # Main server file
│   ├── package.json            # Backend dependencies
│   ├── models/                 # Database models
│   │   ├── userModel.js
│   │   ├── studentModel.js
│   │   ├── driveModel.js
│   │   └── otpModel.js
│   └── routes/                 # API routes
│       ├── userRoutes.js
│       ├── studentRoutes.js
│       ├── driveRoutes.js
│       └── dashboardRoutes.js
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Layout.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── StudentDetailModal.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── StudentsPage.jsx
│   │   ├── data/               # Mock data
│   │   │   ├── mockStudents.js
│   │   │   └── mockDrives.js
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # React entry point
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   └── tailwind.config.js      # Tailwind configuration
└── README.md                   # Project documentation
```

## 🔧 Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
npm run dev      # Start with nodemon (development)
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Drives
- `GET /api/drives` - Get all drives
- `POST /api/drives` - Create new drive
- `PUT /api/drives/:id` - Update drive
- `DELETE /api/drives/:id` - Delete drive

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- A. P. Shah Institute of Technology (APSIT)
- Computer Department Faculty and Students
- React and Node.js communities

---

**Built with ❤️ for efficient placement management**
