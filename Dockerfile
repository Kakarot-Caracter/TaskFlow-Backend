# ---- BUILD STAGE ----
FROM node:20-alpine AS builder
WORKDIR /app

# Instala dependencias
COPY package*.json ./
RUN npm ci

# Copia el código fuente
COPY . .

# Compila NestJS
RUN npm run build

# ---- PRODUCTION STAGE ----
FROM node:20-alpine
WORKDIR /app

# Copia package.json e instala dependencias sin dev
COPY package*.json ./
RUN npm ci --omit=dev

# Copiamos el código compilado y el schema de Prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY .env .env

# Generamos el cliente Prisma aquí (dentro de node_modules)
RUN npx prisma generate

EXPOSE 3001

CMD ["node", "dist/main.js"]
