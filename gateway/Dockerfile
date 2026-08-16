# Stage 1: Build and dependency resolution
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

# Stage 2: Production Runner Stage
FROM alpine:3.24 AS runner
WORKDIR /app

RUN apk add --no-cache nodejs npm && \
    addgroup -S appgroup && adduser -S -u 10001 appuser -G appgroup

COPY --from=builder --chown=appuser:appgroup /app ./

USER 10001

EXPOSE 8000

CMD ["npm", "start"]
