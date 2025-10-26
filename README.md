# 📋 Task Manager Pro (LocalStorage Edition)

A modern, client-side task management application built with React. This application provides an intuitive interface for managing your daily tasks with advanced features like user authentication, localStorage-based data storage, smart filtering, and beautiful modern UI design.

## ✨ Live Demo

**🚀 Check out the live demo: [https://task-manager-omega-rust.vercel.app/](https://task-manager-omega-rust.vercel.app/)**

Use the demo credentials to try the application:
- **Email**: demo@taskmanager.com
- **Password**: demo123

## ✨ Features

### 🔐 Authentication & Security
- **User Registration & Login**: Client-side authentication with localStorage
- **Session Management**: Automatic login persistence

### 📝 Task Management
- **Full CRUD Operations**: Create, edit, delete, and mark tasks as complete
- **LocalStorage Storage**: Data persistence using browser localStorage
- **Advanced Search**: Real-time search functionality across titles and descriptions
- **Smart Filtering**: Filter by status, priority, category, and due date
- **Task Categories**: Organize tasks with work, personal, shopping, health categories
- **Priority Levels**: High, medium, and low priority with visual indicators
- **Due Dates**: Set and track task deadlines

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
- **LocalStorage** - Client-side data persistence

### Development Tools
- **Hot Module Replacement** - Real-time development updates
- **ESLint & Prettier** - Code quality and formatting

## 📎 Quick Start

### Prerequisites
- **Node.js** (version 14 or higher)
- **npm** or **yarn**

### 🚀 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Reddy076/Task-manager.git
cd Task-manager
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Access the application:**
   - **Frontend**: http://localhost:3006 (or the port shown in your terminal)

### 🎨 Using the Application

#### Option 1: Use Demo Account (Easiest)
1. Open the application in your browser
2. On the login page, click the "Fill Demo Credentials" button
3. Click "Sign In"
4. You're now logged in with the demo account!

#### Option 2: Manual Login
1. Open the application in your browser
2. Enter these credentials:
   - **Email**: demo@taskmanager.com
   - **Password**: demo123
3. Click "Sign In"

#### Option 3: Create Your Own Account
1. Open the application in your browser
2. Click "Create Account"
3. Fill in your details:
   - First Name
   - Last Name
   - Username
   - Email
   - Password (minimum 6 characters)
4. Click "Create Account"
5. You'll be automatically logged in

### 📝 After Logging In
Once logged in, you can:
- Create new tasks using the form at the top
- Mark tasks as complete by clicking the checkbox
- Edit tasks by clicking on them
- Delete tasks using the delete button
- Filter tasks by status (All, Active, Completed)
- Search for tasks using the search bar
- View statistics about your tasks
- Switch between light and dark themes

## 🏗️ Build for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📁 Project Structure

```
task-manager/                      # Unified Full-Stack Repository
├── src/                           # React Frontend
│   ├── components/                # Reusable UI components
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
│   │   └── taskAPI.js           # LocalStorage service layer
│   ├── Styles/                  # Component-specific CSS files
│   │   ├── AuthForm.css
│   │   ├── NotificationSystem.css
│   │   ├── TaskFilter.css
│   │   ├── TaskForm.css
│   │   ├── TaskItem.css
│   │   ├── TaskList.css
│   │   ├── TaskSearch.css
│   │   ├── TaskStats.css
│   │   └── ThemeToggle.css
│   ├── App.jsx                      # Main app component
│   ├── App.css                      # Enhanced styling
│   ├── index.css                    # Global styles
│   └── main.jsx
├── index.html                     # Frontend HTML template
├── package.json                   # Frontend dependencies
├── vite.config.js                 # Vite configuration
└── README.md                      # Project documentation
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
- **Real-time Updates**: All changes are instantly saved to localStorage
- **Smart Notifications**: Get alerts for overdue tasks and important updates
- **Theme Switching**: Toggle between dark and light modes
- **Responsive Design**: Works perfectly on all devices
- **Session Management**: Stay logged in with automatic session persistence

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
- **GitHub Pages** (Free static hosting)

Simply build the project with `npm run build` and deploy the `dist` folder.

## 📞 Support

If you have any questions or need help with the project, please open an issue on GitHub.

## 🎯 Features Removed in This Edition

In this localStorage-only edition, the following backend-dependent features have been removed:
- Real-time database storage (MongoDB)
- User account synchronization across devices
- Server-side authentication
- API rate limiting
- Backend-based security features

Data is now stored locally in your browser's localStorage and will not be synchronized across devices or browsers.

---

**Made with ❤️ using React and localStorage**