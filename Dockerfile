# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install
RUN cd backend && npm install

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install production dependencies only
RUN npm ci --only=production
RUN cd backend && npm ci --only=production

# Copy built files
COPY --from=build /app/dist ./dist
COPY --from=build /app/backend ./backend

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "backend/server.js"]