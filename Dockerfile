# ===================================================
# Dockerfile for Cloud-Based Student Project Management System
# Optimized for free cloud VM instances (t2.micro / low memory)
# ===================================================

FROM node:20-alpine AS runner

# Create app directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Install dependencies first (leverage Docker cache)
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose web application port
EXPOSE 3000

# Volume for persistent database storage
VOLUME ["/app/data"]

# Start the application
CMD ["node", "server.js"]
