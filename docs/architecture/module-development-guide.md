# Module Development Guide

This guide details the process for building any new feature module within the DAFT Arena enterprise platform. Every module must strictly adhere to this structure.

## 1. Scaffold from Template
When starting a new module (e.g., `SportsEngine`), copy the `src/modules/_template` directory.
Rename it to your module's domain (e.g., `src/modules/sports`).

## 2. Database Modeling (`models/`)
- Mongoose is the single source of truth for persistence.
- Define interfaces extending `IBaseDocument` from `src/lib/db/BaseSchema.ts`.
- Use `createBaseSchema` to inject timestamps, soft-deletes, and audit fields automatically.
- Export the typed Mongoose `Model`.

## 3. Repositories (`repositories/`)
- Create a repository class extending `BaseRepository<IDomainInterface>`.
- The BaseRepository provides `create`, `findById`, `findOne`, `findMany`, `update`, `delete`, `paginate`, and `search`.
- Only add custom methods to your repository if the query requires complex aggregations or specific $lookups that generic methods cannot solve.

## 4. Validators & DTOs (`validators/`, `dto/`)
- Define Zod schemas for all inbound data (e.g., `CreateSportSchema`).
- Extract TypeScript types from Zod schemas to use as Data Transfer Objects (DTOs) for the Service layer.

## 5. Services (`services/`)
- House core business logic here.
- Inject the necessary Repositories via constructor.
- Never pass `req` or `res` objects into Services. Only pass primitive data or DTOs.
- Handle transactional operations utilizing `this.repository.withTransaction(...)`.

## 6. Controllers / API Routes (`apps/web/src/app/api/`)
- API endpoints act purely as thin orchestration layers (Controllers).
- Extract headers, URL parameters, and request body.
- Validate the request using Zod validators.
- Call the Service layer.
- Catch domain errors and format them to generic JSON using shared response utilities.

## 7. Configuration & Container (`src/lib/container.ts`)
- Instantiate your new Repositories and Services as singletons within the Dependency Injection container.
- Export the service instances for the API routes to consume.
