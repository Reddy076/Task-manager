# 📋 Task Manager Pro

A modern, full-stack task management application built with React, Express.js, and MongoDB. This application provides an intuitive interface for managing your daily tasks with advanced features like user authentication, real-time database storage, smart filtering, and beautiful modern UI design.

## ✨ Features

### 🔐 Authentication & Security
- **User Registration & Login**: Secure JWT-based authentication system
- **Rate Limiting**: Protection against brute force attacks (5 attempts per 15 minutes)
- **Auto-dismissing Error Messages**: Smart error handling with countdown timers
- **Session Management**: Automatic token refresh and secure logout

### 📝 Task Management
- **Full CRUD Operations**: Create, edit, delete, and mark tasks as complete
- **Real-time Database Storage**: MongoDB integration with automatic fallback to file storage
- **Advanced Search**: Real-time search functionality across titles and descriptions
- **Smart Filtering**: Filter by status, priority, category, and due date
- **Task Categories**: Organize tasks with work, personal, shopping, health categories
- **Priority Levels**: High, medium, and low priority with visual indicators
- **Due Dates**: Set and track task deadlines with overdue notifications

### 🎨 Modern UI & UX
- **Glassmorphism Design**: Beautiful glass-like interface with backdrop blur effects
- **Enhanced Authentication Page**: Professional login/registration forms with animations
- **Interactive Welcome Section**: Animated user info with modern styling
- **Theme Toggle**: Dark/Light mode support with consistent styling
- **Responsive Design**: Seamlessly adapts to desktop, tablet, and mobile devices
- **Micro-interactions**: Smooth animations and hover effects throughout

### 📊 Analytics & Insights
- **Task Statistics**: Visual dashboard showing completion metrics
- **Progress Tracking**: Real-time updates on task completion status
- **Notification System**: Smart notifications for important updates

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern JavaScript library with hooks and context
- **Vite** - Lightning-fast build tool and development server
- **CSS3** - Custom styling with glassmorphism and modern design principles
- **Context API** - State management for authentication and app data

### Backend
- **Express.js** - Fast and minimalist web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling
- **JWT** - JSON Web Tokens for secure authentication
- **bcrypt** - Password hashing for security
- **Rate Limiting** - Express rate limit for API protection

### Development Tools
- **Hot Module Replacement** - Real-time development updates
- **ESLint & Prettier** - Code quality and formatting
- **CORS** - Cross-origin resource sharing configuration

## 📎 Quick Start

### Prerequisites
- **Node.js** (version 14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

### 🚀 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Reddy076/Task-manager.git
cd Task-manager
```

2. **Set up the Backend:**
```bash
cd backend
npm install

# Set up MongoDB (choose one option):
# Option 1: Local MongoDB
npm run setup-mongodb

# Option 2: Use MongoDB Atlas
# Create .env file and add your MongoDB Atlas connection string
echo "MONGODB_URI=your_mongodb_atlas_connection_string" > .env

# Start the backend server
npm start
```

3. **Set up the Frontend (open new terminal):**
```bash
# From the root directory
npm install
npm run dev
```

4. **Access the application:**
   - **Frontend**: http://localhost:3001
   - **Backend API**: http://localhost:5000

### 🎨 Demo Credentials
For quick testing, use these demo credentials:
- **Email**: demo@taskmanager.com
- **Password**: demo123

## 🏗️ Build for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📁 Project Structure

```
task-manager/                      # Unified Full-Stack Repository
├── backend/                       # Express.js Backend
│   ├── models/
│   │   ├── User.js              # User authentication model
│   │   └── Task.js              # Task management model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── tasks.js             # Task CRUD routes
│   │   └── users.js             # User management routes
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── utils/
│   │   ├── dbConnection.js      # Database connection handler
│   │   └── fileStorage.js       # File storage fallback
│   ├── server.js                     # Main server file
│   └── package.json                  # Backend dependencies
│
├── src/                           # React Frontend
│   ├── components/
│   │   ├── AuthForm.jsx         # Login/Registration form
│   │   ├── NotificationSystem.jsx
│   │   ├── TaskFilter.jsx
│   │   ├── TaskForm.jsx
│   │   ├── TaskItem.jsx
│   │   ├── TaskList.jsx
│   │   ├── TaskSearch.jsx
│   │   ├── TaskStats.jsx
│   │   └── ThemeToggle.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx      # Authentication context
│   ├── services/
│   │   └── taskAPI.js           # API service layer
│   ├── App.jsx                      # Main app component
│   ├── App.css                      # Enhanced styling
│   ├── index.css                    # Global styles
│   └── main.jsx
├── index.html                     # Frontend HTML template
├── package.json                   # Frontend dependencies
├── vite.config.js                 # Vite configuration
├── README.md                      # Project documentation
└── AUTHENTICATION_GUIDE.md        # Authentication setup guide
```

## 🎨 Usage Guide

### 🔐 Getting Started
1. **Register**: Create a new account with your email and password
2. **Login**: Use your credentials or demo account to access the dashboard
3. **Dashboard**: View your personalized task management interface

### 📝 Task Management
- **Create Tasks**: Use the form to add new tasks with priorities and categories
- **Edit Tasks**: Click on any task to modify its details
- **Complete Tasks**: Check off completed tasks
- **Delete Tasks**: Remove tasks you no longer need
- **Search & Filter**: Find specific tasks using the search bar and filters

### 📈 Features in Action
- **Real-time Updates**: All changes are instantly saved to the database
- **Smart Notifications**: Get alerts for overdue tasks and important updates
- **Theme Switching**: Toggle between dark and light modes
- **Responsive Design**: Works perfectly on all devices
- **Session Management**: Stay logged in with automatic token refresh

### 🔒 Security Features
- **Rate Limiting**: Protection against brute force attacks
- **Auto-logout**: Secure session management
- **Password Encryption**: bcrypt hashing for secure password storage
- **JWT Tokens**: Secure authentication with automatic refresh

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Deployment

This project is ready for deployment on platforms like:
- **Vercel** (Recommended for React apps)
- **Netlify** (Great for static deployments)
- **Railway** (Perfect for full-stack apps with database)
- **Heroku** (Traditional cloud platform)

### Backend Deployment Notes:
- Set environment variables for MongoDB connection
- Configure CORS for your production domain
- Set NODE_ENV to "production"

### Frontend Deployment Notes:
- Update API URLs to production backend
- Build the project with `npm run build`
- Deploy the `dist` folder

## 📞 Support

If you have any questions or need help with the project, please open an issue on GitHub.

## 🎯 Roadmap

- [ ] Mobile app version
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] File attachments for tasks
- [ ] Calendar integration
- [ ] Email notifications

---

**Made with ❤️ using React, Express.js, and MongoDB**