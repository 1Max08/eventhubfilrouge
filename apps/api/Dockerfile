FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/api/package.json ./apps/api/package.json

RUN npm ci --ignore-scripts

COPY apps/api/tsconfig.json ./apps/api/tsconfig.json
COPY apps/api/src ./apps/api/src

RUN npm run build -w api


FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY apps/api/package.json ./apps/api/package.json

RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 3000

USER node

CMD ["node", "apps/api/dist/index.js"]