# DAFT Arena Development Standards

## 1. Folder Structure Standards
- `src/lib/`: Shared, reusable infrastructure (config, db, errors, logger, helpers, constants, types, validators).
- `src/modules/`: Domain-specific business logic following a standard template.
- `src/app/api/`: Next.js App Router endpoints which act as light wrappers (Controllers) invoking Services.

## 2. File Naming Conventions
- Classes and Interfaces: PascalCase (e.g., `UserService.ts`, `IUser.ts`)
- Repositories: camelCase with suffix (e.g., `user.repository.ts`)
- Services: camelCase with suffix (e.g., `user.service.ts`)
- Models: PascalCase (e.g., `User.ts`)
- Utility/Helpers: camelCase (e.g., `dateHelper.ts`)

## 3. API Naming Standards
- Use plural nouns for resources (e.g., `/api/users`, not `/api/user`).
- Use HTTP verbs properly: GET (read), POST (create), PUT/PATCH (update), DELETE (remove).
- Use camelCase for JSON request/response payloads.

## 4. Database Modeling Standards
- Mongoose schemas only. No Prisma.
- Every model must extend `IBaseDocument` and use `createBaseSchema`.
- Explicitly define indexes for querying and unique constraints.

## 5. Mongoose Schema Standards
- Always use `timestamps: true` and `optimisticConcurrency: true`.
- Exclude `_id` and include `id` string via serialization transforms.
- Soft-delete strategy using `isDeleted` and `deletedAt`.

## 6. Repository Standards
- All repositories MUST extend `BaseRepository`.
- Only implement domain-specific complex queries (e.g., aggregation pipelines) in the subclass.
- Rely on `BaseRepository` for generic CRUD, pagination, and search.

## 7. Service Layer Standards
- Contains all business logic.
- Should never return HTTP Response objects. Returns generic DTOs or entity objects.
- Responsible for transaction boundaries using `withTransaction` from the repository.

## 8. Controller/API Route Standards
- Strictly handle HTTP request parsing, header extraction, and Next.js specific logic.
- Delegate data parsing/validation to Validators, logic to Services.
- Return standardized `NextResponse` JSON formats.

## 9. Validation Standards (Zod)
- All request payloads must be validated using Zod.
- Re-use shared validators in `src/lib/validators`.

## 10. Error Handling Standards
- Throw standard errors from Services.
- Controllers catch errors and format them using a generic error response utility.

## 11. Logging Standards
- Use the shared logger utility (`src/lib/logger`). Do not use raw `console.log`.

## 12. Authentication Standards
- JWT based. Tokens managed via HTTP-Only cookies or Bearer headers.
- Utilize the shared authentication guards (`withAuth`).

## 13. Authorization Standards
- RBAC model.
- Utilize the shared permission guards (`withPermission`, `withRole`).

## 14. Testing Standards
- Unit tests must exist for Services and generic Utilities.
- Mock repositories for Service tests.

## 15. Dependency Injection Standards
- Export singleton instances from a centralized container (`src/lib/container.ts` or module-specific `container.ts`).

## 16. Environment Variable Standards
- Define constants for ENV keys in `src/lib/constants`.
- Validate all ENV variables at startup.

## 17. Configuration Standards
- Keep third-party service configurations centralized in `src/lib/config`.

## 18. Event Naming Standards
- `DOMAIN.ACTION.RESULT` (e.g., `user.created.success`).

## 19. TypeScript Standards
- Strict mode enabled. No implicit `any`.
- Utilize shared interfaces in `src/lib/types`.

## 20. Code Style Standards
- Enforced via Prettier and ESLint (pre-commit hooks).
