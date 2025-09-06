# APSIT Placement Portal

A comprehensive placement management system designed specifically for the Computer Department of A. P. Shah Institute of Technology (APSIT).

## 🎯 Project Overview

The APSIT Placement Portal is a modern, responsive web application built with React and Vite that streamlines the entire placement process for students, faculty, and administrators. The system provides a complete solution for managing student profiles, recruitment drives, company interactions, and placement tracking.

## 🚀 Features

### 🔐 Authentication System
- **User Registration**: Complete signup with email verification
- **Secure Login**: Email and password authentication
- **Password Recovery**: OTP-based password reset system
- **Session Management**: Protected routes and authentication state

### 🏠 Landing Page
- **Professional Branding**: APSIT Computer Department identity
- **Clean Design**: Single-screen layout with modern UI
- **Call-to-Action**: Direct navigation to login/signup
- **Responsive Layout**: Optimized for all devices

### 📊 Dashboard & Management
- **Student Management**: Profile management and placement tracking
- **Drive Management**: Recruitment drive organization and monitoring
- **Company Integration**: Company profiles and interaction tracking
- **Analytics Dashboard**: Placement statistics and insights

### 🎨 User Interface
- **Modern Design**: Clean, professional interface
- **Color Scheme**: Teal and blue gradient theme
- **Responsive**: Mobile-first design approach
- **Intuitive Navigation**: Sidebar navigation with clear sections

## 🛠️ Technology Stack

- **Frontend**: React 19.1.1 with Vite
- **Routing**: React Router DOM 7.8.2
- **Styling**: Tailwind CSS 4.1.13
- **Icons**: Lucide React
- **Build Tool**: Vite 7.1.4
- **Language**: JavaScript (ES6+)

## 📋 Complete Summary of Today's Changes

### 🎯 Initial Project Setup
- Started with basic React + Vite template
- Installed all necessary dependencies
- Set up development environment

### 🔐 Authentication System Implementation
- **LoginPage.jsx**: Complete login form with validation
- **SignUpPage.jsx**: User registration with password confirmation
- **ForgotPasswordPage.jsx**: Multi-step OTP password recovery
- Form validation and error handling
- Navigation and routing integration

### 🏠 Home Page Design & Development
- **HomePage.jsx**: Professional landing page
- APSIT branding and Computer Department identity
- Clean, single-screen design
- Responsive header with logo and navigation
- Call-to-action buttons for user engagement

### 🔄 Routing & Authentication Flow
- **App.jsx**: Complete routing system overhaul
- Authentication state management with React hooks
- Protected routes for dashboard access
- Auto-redirect after login/signup
- Nested routing for dashboard sections

### 📊 Dashboard & Management Pages
- Enhanced existing pages with proper functionality
- **StudentsPage**: Student management with search
- **DrivesListPage**: Recruitment drives listing
- **CompanyDetailPage**: Company information display
- **ManageDrivePage**: Drive management interface

### 🎨 UI/UX Improvements
- **Design System**: Consistent color scheme and typography
- **Components**: Layout, StudentDetailModal
- **Responsive Design**: Mobile-friendly across all pages
- **Professional Styling**: Modern shadows, transitions, and spacing

### 📁 Project Structure
```
src/
├── components/
│   ├── Layout.jsx
│   └── StudentDetailModal.jsx
├── data/
│   ├── mockDrives.js
│   └── mockStudents.js
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── SignUpPage.jsx
│   ├── ForgotPasswordPage.jsx
│   ├── DashboardPage.jsx
│   ├── StudentsPage.jsx
│   ├── DrivesListPage.jsx
│   ├── CompanyDetailPage.jsx
│   └── ManageDrivePage.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aradhyya/APSIT-Placement-Portal-.git
   cd e-placement-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173/
   ```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📱 Usage

1. **Visit the home page** - Clean landing page with APSIT branding
2. **Create Account** or **Login** - Authentication system
3. **Access Dashboard** - Main placement management interface
4. **Navigate Sections** - Students, Drives, Companies
5. **Manage Data** - Add, edit, and track placement activities

## 🎯 Key Achievements

- ✅ **Complete Authentication System** (Login, SignUp, Forgot Password)
- ✅ **Beautiful Home Page** with APSIT branding
- ✅ **Working Dashboard** with full navigation
- ✅ **Responsive Design** across all pages
- ✅ **Professional UI/UX** with consistent styling
- ✅ **Functional Routing** with authentication flow
- ✅ **Mock Data Integration** for testing
- ✅ **Clean Code Structure** with organized components

## 📈 Development Stats

- **Total Files**: 15+ files created/modified
- **Lines of Code**: 1000+ lines
- **Features Implemented**: 10+ major features
- **Development Time**: ~2 hours
- **Technologies Used**: 6+ modern web technologies

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
- React and Vite communities

---

**Built with ❤️ for APSIT Computer Department**

© 2025 APSIT Placement Portal. All rights reserved.
