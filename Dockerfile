FROM node:latest AS base

# Install bun
WORKDIR /app
RUN npm install -g bun@latest

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json ./
RUN bun install

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
ADD package.json ./
RUN bun install --production

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .

# Generate docs BEFORE build (needs TypeScript source files)
RUN echo 'NODE_ENV=production' > .env && \
    echo 'PORT=3333' >> .env && \
    echo 'HOST=0.0.0.0' >> .env && \
    echo 'LOG_LEVEL=info' >> .env && \
    echo 'APP_KEY=dummy_key_for_docs_generation_only' >> .env && \
    echo 'DB_HOST=localhost' >> .env && \
    echo 'DB_PORT=5432' >> .env && \
    echo 'DB_USER=dummy' >> .env && \
    echo 'DB_DATABASE=dummy' >> .env && \
    echo 'DB_PASSWORD=dummy' >> .env && \
    echo 'DRIVE_DISK=fs' >> .env && \
    node ace docs:generate && \
    rm .env

RUN node ace build --ignore-ts-errors

# Copy swagger files to build directory
RUN cp swagger.json build/swagger.json && cp swagger.yml build/swagger.yml

# Production stage
FROM base
WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app

EXPOSE 3333
CMD ["node", "./bin/server.js"]
