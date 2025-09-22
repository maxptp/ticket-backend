# Ticket System (NestJS + BullMQ + Redis)

A simple Ticket System with CRUD operations, background jobs, and queue monitoring.

## Features

- CRUD Tickets (Create, Read, Update, Delete with soft delete)
- Queue integration (BullMQ + Redis)
  - `TicketNotifyJob` (immediate, retry + backoff)
  - `TicketSlaJob` (delayed 15 min, removed when resolved)
- Queue metrics endpoint: `GET /admin/queues/:name/stats`
- Validation & error handling (400, 422, 404, 500)

## Tech Stack

- **Backend**: NestJS, TypeScript, TypeORM
- **Database**: PostgreSQL
- **Queue**: BullMQ + Redis
- **Frontend**: Next.js (App Router, TS)

## Getting Started

### 1. Environment Variables (`.env`)

````env
NODE_ENV=develop

# PG config
POSTGRES_HOST=host.docker.internal
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456789
POSTGRES_DATABASE=ticket_local_api

# Redis
REDIS_HOST=host.docker.internal
REDIS_PORT=6379

### 2. Create Databases
CREATE DATABASE ticket_local_api;

### 3. Install Dependencies
npm install

### 4. Run Redis
```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

### 5. Run Migrations

```bash
npm run typeorm migration:run
```

### 6. Start Development Server

```bash
npm run start:dev
```
```
````
