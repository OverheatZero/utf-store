FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV DATABASE_URL="postgresql://fake:fake@localhost:5432/fake"

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="postgresql://fake:fake@localhost:5432/fake"

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npm ci
RUN npx prisma generate --schema=./prisma/schema.prisma

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
