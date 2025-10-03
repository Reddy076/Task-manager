# 🚀 Deployment Guide

This document explains how to deploy the Task Manager application to various platforms.

## 🌐 Frontend Deployment (Vercel)

### Prerequisites
1. Create an account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm install -g vercel`

### Deployment Steps
1. Go to your Vercel dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables:
   - `REACT_APP_API_URL`: URL of your deployed backend

## ⚙️ Backend Deployment (Render)

### Prerequisites
1. Create an account at [render.com](https://render.com)

### Deployment Steps
1. Go to your Render dashboard
2. Click "New Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: task-manager-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend`
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret
   - `NODE_ENV`: production
   - `PORT`: 8080
   - `FRONTEND_URL`: Your frontend URL

## 🗄️ Database Setup (MongoDB Atlas)

### Prerequisites
1. Create an account at [cloud.mongodb.com](https://cloud.mongodb.com)

### Setup Steps
1. Create a new cluster
2. Create a database user
3. Whitelist IP addresses (0.0.0.0/0 for development)
4. Get the connection string and update `MONGODB_URI` environment variable

## 🔧 Environment Variables

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

### Backend (Render)
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key_here
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://your-frontend.vercel.app
```

## 🔄 Deployment Updates

After initial deployment, you can update your application by pushing changes to your GitHub repository. Both Vercel and Render will automatically deploy new changes.

## 📊 Monitoring

Consider setting up:
1. Error tracking with Sentry
2. Performance monitoring
3. Uptime monitoring
4. Analytics