# Task Manager Backend

This is the backend API for the Task Manager application, built with Express.js and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/taskmanager
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://taskmanageruser:zk1e9yCKlGoqdXTj@your-cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
```

### Running the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🗄️ Database Setup

### Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service
3. The application will automatically connect to `mongodb://localhost:27017/taskmanager`

### MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a cluster
3. Create a database user with:
   - Username: `taskmanageruser`
   - Password: `zk1e9yCKlGoqdXTj`
4. Whitelist your IP address
5. Update the `MONGODB_URI` in your `.env` file

## 🛠️ Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run setup-db` - Set up database
- `npm run setup-mongodb` - Set up MongoDB connection

## 📁 Project Structure

```
backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── docs/            # Documentation
├── server.js        # Main server file
└── .env             # Environment variables
```

## 🔐 Security

- JWT tokens for authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Helmet.js for HTTP security headers
- CORS configuration for cross-origin requests

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 📦 Dependencies

### Production
- express - Web framework
- mongoose - MongoDB object modeling
- bcryptjs - Password hashing
- jsonwebtoken - JWT implementation
- cors - Cross-origin resource sharing
- helmet - Security headers
- morgan - HTTP request logger
- dotenv - Environment variables
- cookie-parser - Cookie parsing

### Development
- nodemon - Auto-restart server during development
- concurrently - Run multiple commands concurrently

## 🚀 Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed deployment instructions.