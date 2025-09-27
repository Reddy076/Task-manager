# Task Manager Backend

A robust Express.js backend with MongoDB integration and JWT authentication for the Task Manager application.

## 🚀 Quick Start

### Option 1: File Storage (Development)
Perfect for immediate development without MongoDB setup:

```bash
# Clone and install dependencies
cd task-manager-backend
npm install

# Start the development server
npm run dev
```

The backend will automatically use file-based storage if MongoDB is not available.

### Option 2: MongoDB Atlas (Cloud) - Recommended
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free account and cluster
3. Create a database user with password
4. Whitelist your IP address (0.0.0.0/0 for development)
5. Get your connection string
6. Update `.env` file:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskmanager?retryWrites=true&w=majority
```

### Option 3: Local MongoDB
1. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Update `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/taskmanager
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run setup-db` - Test and setup database connection
- `npm run dev:both` - Start both backend and frontend concurrently

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion
- `GET /api/tasks/stats` - Get task statistics
- `POST /api/tasks/bulk` - Bulk operations (complete/delete)

### Subtasks
- `POST /api/tasks/:id/subtasks` - Add subtask
- `PATCH /api/tasks/:id/subtasks/:subtaskId` - Update subtask
- `DELETE /api/tasks/:id/subtasks/:subtaskId` - Delete subtask

### Export/Import
- `GET /api/export/json` - Export tasks as JSON
- `GET /api/export/csv` - Export tasks as CSV
- `POST /api/export/import` - Import tasks from JSON
- `GET /api/export/backup` - Create full backup
- `POST /api/export/restore` - Restore from backup

## 🔐 Security Features

- JWT-based authentication with access and refresh tokens
- Password hashing with bcrypt (cost factor 12)
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Input validation and sanitization
- Account lockout after failed login attempts
- Secure HTTP headers with Helmet.js

## 📊 Features

### Advanced Task Management
- ✅ Complete CRUD operations
- ✅ Categories and priorities
- ✅ Tags and due dates
- ✅ Subtasks with progress tracking
- ✅ Bulk operations
- ✅ Search and filtering
- ✅ Task statistics

### Data Management
- ✅ JSON/CSV export
- ✅ Data import with merge strategies
- ✅ Complete backup/restore
- ✅ Cross-device synchronization

### Storage Options
- ✅ MongoDB Atlas (Cloud)
- ✅ Local MongoDB
- ✅ File-based storage (Development fallback)

## 🌍 Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/taskmanager

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## 🧪 Testing the Setup

Run the database setup script:
```bash
npm run setup-db
```

This will test your MongoDB connection and provide guidance for setup.

## 📁 Project Structure

```
task-manager-backend/
├── models/           # Database models
│   ├── User.js      # User schema
│   └── Task.js      # Task schema
├── routes/          # API routes
│   ├── auth.js      # Authentication routes
│   ├── tasks.js     # Task management routes
│   ├── users.js     # User management routes
│   └── export.js    # Data export/import routes
├── middleware/      # Custom middleware
│   └── auth.js      # Authentication middleware
├── utils/           # Utility functions
│   ├── jwt.js       # JWT utilities
│   └── fileStorage.js # File-based storage fallback
├── data/            # File storage (auto-created)
├── server.js        # Main server file
└── .env            # Environment variables
```

## 🚀 Deployment

The backend is production-ready and can be deployed to:
- Heroku
- Vercel
- AWS
- DigitalOcean
- Any Node.js hosting service

Make sure to:
1. Set production environment variables
2. Use MongoDB Atlas for production database
3. Update CORS origins for production domains
4. Enable SSL/HTTPS

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (local) or connection string is correct (Atlas)
- Check firewall settings and IP whitelist
- Verify username/password in connection string

### Backend Not Starting
- Check port 5000 is not in use
- Verify all dependencies are installed (`npm install`)
- Check `.env` file configuration

### Authentication Issues
- Ensure JWT_SECRET is set in `.env`
- Check CORS configuration
- Verify frontend URL in CORS settings

## 📞 Support

If you encounter any issues:
1. Check the console logs for error messages
2. Run `npm run setup-db` to diagnose database issues
3. Ensure all environment variables are properly set
4. Check that all dependencies are installed

---

**Status: ✅ Backend fully functional with file storage fallback!**

Your Task Manager backend is ready to use. Start the server with `npm run dev` and connect your React frontend!