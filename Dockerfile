# ============================================================
# Stage 1: DEPS — Install dependencies
# ============================================================
FROM node:20-alpine AS deps

# Install libc compat untuk Alpine (dibutuhkan beberapa native module)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy manifest dulu (memanfaatkan Docker layer cache)
COPY package*.json ./

# npm ci: install exact version dari package-lock.json
# Lebih cepat & deterministic dibanding npm install untuk CI/CD
RUN npm ci

# ============================================================
# Stage 2: BUILDER — Build aplikasi Next.js
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy node_modules dari stage deps
COPY --from=deps /app/node_modules ./node_modules

# Copy seluruh source code
COPY . .

# Build Next.js (output: standalone aktif via next.config.js)
RUN npm run build

# ============================================================
# Stage 3: RUNNER — Production image (ringan)
# ============================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment production
ENV NODE_ENV=production

# Buat user non-root (security best practice)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy hanya file yang dibutuhkan dari stage builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Jalankan sebagai non-root user
USER nextjs

# Port yang dipakai Next.js
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Jalankan server standalone Next.js (bukan npm start)
CMD ["node", "server.js"]