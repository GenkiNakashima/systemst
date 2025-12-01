# Frontend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Build application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start application
CMD ["npm", "start"]
