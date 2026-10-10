# ==========================================
# Build stage
# ==========================================
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

# Reuse npm cache and tolerate slower networks.
RUN --mount=type=cache,target=/root/.npm \
    npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set fetch-timeout 300000 \
    && npm ci --no-audit --no-fund

COPY . .

# These are public frontend routes, not secrets.
RUN VITE_API_BASE_URL=/api/leaves \
    VITE_AUTH_API_URL=/api/auth \
    VITE_EMPLOYEE_API_URL=/api/users/employees \
    npm run build


# ==========================================
# Runtime stage
# ==========================================
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build \
    /app/dist \
    /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
