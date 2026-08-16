# Stage 1: Single-file JS compilation stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src ./src
RUN npx @vercel/ncc build src/server.js -o dist

# Stage 2: Production Runner Stage (Alpine 3.24 ~ 0 CVEs)
FROM alpine:3.24 AS runner
WORKDIR /app

# hadolint ignore=DL3018
RUN apk add --no-cache nodejs && \
    addgroup -S appgroup && adduser -S -u 10001 appuser -G appgroup

COPY --from=builder /app/dist/index.js ./index.js

USER 10001

EXPOSE 8003

CMD ["node", "index.js"]