# ---------- deps: solo producción ----------
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# ---------- build: con dependencias de desarrollo ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

# Compila Adonis a /build
RUN npm run build

# ---------- runner: imagen final pequeña ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3333
ENV HOST=0.0.0.0

# Copiamos solo dependencias de producción
COPY --from=deps /app/node_modules ./node_modules

# Copiamos el build compilado
COPY --from=build /app/build ./build

EXPOSE 3333

CMD ["node", "build/bin/server.js"]