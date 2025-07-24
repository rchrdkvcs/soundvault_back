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

RUN node ace docs:generate
RUN node ace build --ignore-ts-errors

# Production stage
FROM base
WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
COPY --from=build /app/swagger.json /app/
COPY --from=build /app/swagger.yml /app/

EXPOSE 3333
CMD ["node", "./bin/server.js"]
