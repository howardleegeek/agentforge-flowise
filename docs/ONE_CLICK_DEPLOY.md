# AgentForge One-Click Deploy Guide

This document describes how to deploy AgentForge using Docker and Docker Compose with a single command flow. It is compatible with both local development and production stacks.

Prerequisites

- Docker and Docker Compose installed on the host
- Access to repository containing docker/ configuration from this project

Deploy (Development / Local)

- Build the image:
    ```bash
    docker build -t agentforge .
    ```
- Start the service:
    ```bash
    docker-compose -f docker/docker-compose.yml up -d
    ```

Deploy (Production)

- The production override file is docker/docker-compose.prod.yml
- Build the image (same as development):
    ```bash
    docker build -t agentforge .
    ```
- Bring up production services with overrides:
    ```bash
    docker-compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml up -d
    ```

Environment Variables (Key Vars)

- DISPATCH_ENABLED: Enable dispatch mode (default false locally, true in prod)
- DISPATCH_CONTROLLER_URL: URL of the dispatch controller service
- DISPATCH_ENABLED_PROD: Production override for DISPATCH_ENABLED (in prod compose)
- DISPATCH_CONTROLLER_URL_PROD: Production override for DISPATCH_CONTROLLER_URL (in prod compose)
- PORT: Server port the app will listen on (default 3000)
- DATABASE\_\*: Database configuration (supporting sqlite, mysql, postgresql)
- APP_URL: Base URL for the app (used in tokens, callbacks, etc.)
- SECRETKEY\_\*: Security keys and credentials (do not commit real secrets)

Documentation notes

- The repository already contains: docker/docker-compose.yml, docker/docker-compose.prod.yml, docker/Dockerfile and a sample environment file .env.example
- The production overrides will be picked up automatically when using the -f flags as shown above.
- The .env.example file documents all required environment variables including DISPATCH\_\* entries.

Usage tips

- For multi-host or ARM64/AMD64 compatibility, rely on the existing multi-platform build support in the Dockerfile (BUILDPLATFORM) and the compose files.
- Do not modify the core Docker configuration unless you purposefully want to change the deployment behavior.

These files implement the one-click deployment workflow in a standards-compliant and maintainable way.
