# Stage 1: Build stage
FROM --platform=$BUILDPLATFORM node:20-alpine AS build

ARG IMAGE_NAME=agentforge
LABEL org.opencontainers.image.title=$IMAGE_NAME
LABEL org.opencontainers.image.description="AgentForge Docker image"

USER root

ENV PUPPETEER_SKIP_DOWNLOAD=true

RUN npm install -g pnpm

COPY . /build
WORKDIR /build
RUN pnpm install && pnpm build

# Stage 2: Runtime stage
FROM --platform=$BUILDPLATFORM node:20-alpine

RUN apk add --no-cache chromium git python3 py3-pip make g++ build-base cairo-dev pango-dev curl

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV NODE_OPTIONS=--max-old-space-size=8192

WORKDIR /usr/src/agentforge

COPY --from=build /build /usr/src/agentforge

RUN chown -R node:node .

USER node

EXPOSE 3000

CMD [ "pnpm", "start" ]
