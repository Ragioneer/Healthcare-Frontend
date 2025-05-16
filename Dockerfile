# This is a sample Dockerfile showing how to handle environment variables properly
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all files
COPY . .

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Copy necessary files from the build stage
COPY --from=base /app/next.config.js ./
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]