# -------- STAGE 1: Build --------
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Copy package files
    COPY package*.json ./
    
    # ✅ Install all deps including devDependencies like tailwindcss
    RUN npm install --legacy-peer-deps --include=dev
    
    # Copy source code
    COPY . .
    
    # Build the app
    RUN npm run dev
    