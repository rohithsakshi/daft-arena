# Architecture Lifecycle Flows

## Request Lifecycle
1. **Client**: Sends HTTP Request.
2. **Next.js Router**: Routes request to specific `app/api/.../route.ts`.
3. **Middleware/Guards**: Validates Authentication JWT and Authorization Permissions.
4. **Controller (Route Handler)**: Parses body/params, validates via Zod.
5. **Service**: Receives validated DTO, applies business rules, interacts with DB/external services.
6. **Controller**: Formats Service response to JSON using standard API response helpers.
7. **Client**: Receives standardized JSON response.

## Repository Lifecycle
1. **Instantiate**: Inherits from `BaseRepository<T>`.
2. **Query Execution**: Extends generic methods or defines domain-specific queries.
3. **Serialization**: `BaseRepository` automatically transforms `_id` to `id` string and formats models.
4. **Soft Delete**: Deletes mark `isDeleted: true` instead of hard removal.

## Database Lifecycle
1. **Connection**: Singleton manager establishes Mongoose connection on startup.
2. **Schema Definition**: Models use `createBaseSchema` injecting standard fields.
3. **Indexing**: Background index creation ensures optimal querying.
4. **Optimistic Concurrency**: Prevents lost updates using `version` key.

## Dependency Injection Flow
1. **Instantiation**: Services and Repositories are instantiated once in `src/lib/container.ts` or module-specific containers.
2. **Wiring**: Repositories are injected into Services via constructor/arguments.
3. **Export**: The instantiated, configured Service singletons are exported for Controllers to consume.

## Error Flow
1. **Throw**: Services throw specific standard errors (Validation, NotFound, Forbidden).
2. **Catch**: Controllers catch errors.
3. **Format**: Error mapping logic translates JS Error to standard JSON API Error Response.
4. **Log**: Critical server errors are logged via shared logger before responding.
