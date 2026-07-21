# Module Template

This directory serves as the template for all future domain modules (e.g., Sports, Tournaments, Matches, etc.).
Do not modify this template unless instructed to update the global architecture standards.

## Structure

- `controllers/`: API route handlers and request parsing.
- `services/`: Core business logic and transaction management.
- `repositories/`: Data access layer extending `BaseRepository`.
- `models/`: Mongoose schemas and models extending `BaseSchema`.
- `validators/`: Zod schemas for request validation.
- `dto/`: Data Transfer Objects for service-to-controller communication.
- `types/`: Module-specific TypeScript interfaces and types.
- `constants/`: Module-specific constants (if not global).
- `tests/`: Unit and integration tests for the module.

## Rules
1. Never duplicate shared infrastructure from `src/lib`.
2. Repositories must extend `BaseRepository`.
3. Models must use `createBaseSchema` and implement `IBaseDocument`.
4. Use shared generic helpers, constants, and validators when possible.
