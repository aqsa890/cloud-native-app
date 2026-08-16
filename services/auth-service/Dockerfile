# STAGE 1: Builder Stage (Go 1.26 Alpine)
FROM golang:1.26-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
COPY . .
RUN go mod tidy && go mod download

# Compile binary statically (CGO_ENABLED=0 removes C-deps, -s -w strips debug symbols)
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app/auth-service ./cmd/main.go

# STAGE 2: Production Runner Stage (Alpine 3.24 ~ 0 CVEs)
FROM alpine:3.24 AS runner

WORKDIR /app

RUN addgroup -S appgroup && adduser -S -u 10001 appuser -G appgroup

COPY --from=builder /app/auth-service ./auth-service

RUN chown -R appuser:appgroup /app

USER 10001

EXPOSE 8001

CMD ["./auth-service"]