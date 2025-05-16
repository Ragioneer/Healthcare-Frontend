# -------- STAGE 1: Build --------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# -------- STAGE 2: Production Server --------
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PATH=/app/node_modules/.bin:$PATH

# Copy necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
    