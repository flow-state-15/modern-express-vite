# ============================================
# Stage 1: Build frontend (Vite bundle)
# ============================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ============================================
# Stage 2: Build API
# ============================================
FROM node:20-alpine AS api-builder

WORKDIR /app/api

COPY api/package.json api/package-lock.json ./
RUN npm ci

COPY api/ ./
RUN npx prisma generate && npm run build

# ============================================
# Stage 3: Production runtime
# ============================================
FROM node:20-alpine

WORKDIR /app

# Copy API runtime
COPY --from=api-builder /app/api/package.json /app/api/
COPY --from=api-builder /app/api/package-lock.json /app/api/
COPY --from=api-builder /app/api/dist /app/api/dist/
COPY --from=api-builder /app/api/node_modules /app/api/node_modules/
COPY --from=api-builder /app/api/generated /app/api/generated/

# Copy Prisma schema and config for migrations
COPY --from=api-builder /app/api/prisma /app/api/prisma/
COPY --from=api-builder /app/api/prisma.config.ts /app/api/

# Copy frontend bundle
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist/

WORKDIR /app/api

EXPOSE 3000

# Run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/app.js"]
