# Stage 1: Build Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Production Stage
FROM node:18-alpine
WORKDIR /app
# Only copy the essential files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js ./
COPY --from=builder /app/index.html ./

EXPOSE 3000
CMD ["node", "server.js"]