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

#### Step 1: Set up MongoDB Atlas
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and create an account
2. Create a new cluster (free tier is fine for development)
3. Create a database user with a secure password
4. Whitelist IP addresses:
   - Click "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Add `0.0.0.0/0` to allow connections from any IP (for development)
   - For production, you can add specific IP addresses
5. Get your connection string:
   - Click "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string and replace `<password>` with your actual password

#### Step 2: Create Render Account and Deploy
1. Go to [render.com](https://render.com) and sign up or log in
2. Click "New" → "Web Service"
3. Connect your GitHub repository:
   - Click "Configure account" if prompted
   - Select the repository `Reddy076/Task-manager`
4. Configure the service:
   - **Name**: `task-manager-backend` (or any name you prefer)
   - **Region**: Choose the region closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click "Advanced" to add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string (at least 32 characters)
   - `NODE_ENV`: `production`
   - [PORT](file://c:\Users\mulac\Downloads\Task-manager-main\Task-manager-main\backend\server.js#L11-L11): `8080`
   - `FRONTEND_URL`: Your frontend URL (e.g., `https://task-manager-frontend.onrender.com` or your Vercel URL)
6. Click "Create Web Service"

#### Step 3: Monitor Deployment
1. Render will automatically start building your application
2. You can watch the build logs in real-time
3. Once the build is complete, Render will start your application
4. The deployment URL will be shown on the service dashboard (e.g., `https://task-manager-backend.onrender.com`)

#### Step 4: Test Your Deployment
1. Visit your backend URL and add `/test` to the end (e.g., `https://task-manager-backend.onrender.com/test`)
2. You should see a JSON response: `{"message":"Server is working","timestamp":"..."}`

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

## 🛠️ Troubleshooting Tips

### Common Render Issues

1. **Build Failures**:
   - Check that all dependencies are correctly specified in `backend/package.json`
   - Ensure the build command is `npm install`
   - Verify the start command is `npm start`

2. **Application Crashes**:
   - Check the logs in the Render dashboard
   - Ensure all required environment variables are set
   - Verify the MongoDB connection string is correct

3. **CORS Errors**:
   - Make sure your `FRONTEND_URL` environment variable is set correctly
   - Check that your frontend URL is included in the CORS configuration in `backend/server.js`

4. **Database Connection Issues**:
   - Verify your MongoDB Atlas cluster is running
   - Check that your IP is whitelisted in MongoDB Atlas
   - Ensure your MongoDB user credentials are correct

### How to Check Logs on Render

1. Go to your Render dashboard
2. Click on your `task-manager-backend` service
3. Click on the "Logs" tab
4. You can see real-time logs and filter by time period

### How to Redeploy on Render

1. Push changes to your GitHub repository
2. Render will automatically detect the changes and start a new deployment
3. You can also manually trigger a deployment:
   - Go to your service dashboard
   - Click "Manual Deploy" → "Deploy latest commit"

### How to Update Environment Variables on Render

1. Go to your Render dashboard
2. Click on your `task-manager-backend` service
3. Click on "Environment" in the sidebar
4. Add, edit, or remove environment variables as needed
5. Click "Save Changes" to apply the updates
6. Render will automatically redeploy your application