FROM node:21-alpine3.18 AS builder
LABEL authors="Denis Danilov"
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src/ src/
RUN npm run build

FROM node:21-alpine3.18
ENV NODE_ENV production
USER node
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node","dist/index.js"]