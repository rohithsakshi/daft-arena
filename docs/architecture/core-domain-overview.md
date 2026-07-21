# Core Domain Overview

The `src/modules/core` module is the foundation of the DAFT Arena platform. It contains all shared business logic, enums, interfaces, exceptions, events, and validators. 

## Dependency Rules
1. **Core is Independent**: The Core module must NOT depend on any other domain module (e.g., IAM, Sports).
2. **Universal Dependency**: All other domain modules MUST depend on the Core module for shared business concepts.
3. **No Duplication**: No domain module is allowed to redefine an enum, interface, or constant that already exists in Core.

## Allowed Import Rules
- Domain modules should import shared assets via `@/modules/core/...` (or relative paths if aliases are not configured).
- Valid imports:
  - `import { Gender } from '@/modules/core/enums';`
  - `import { ValidationException } from '@/modules/core/exceptions';`
  - `import { PaginationDto } from '@/modules/core/dto';`

## Core Module Guide
The Core module is structured as follows:
- `enums/`: All shared business enumerations (Gender, MatchStatus, etc.).
- `constants/`: Global business constants (Roles, Error Codes).
- `interfaces/`: Base definitions (`BaseEntity`, `ApiResponse`).
- `dto/`: Generic Data Transfer Objects (`PaginationDto`).
- `validators/`: Zod schemas for shared concepts (`PaginationValidator`).
- `exceptions/`: Domain-specific error classes (`NotFoundException`).
- `events/`: Event type definitions for decoupled communication.

## Shared Components Guide
When developing a new module, always check `src/modules/core` before creating new definitions.
- Need a status for a match? Use `MatchStatus` from Core.
- Need to return a paginated list? Use `PaginatedResponse<T>` from Core.
- Need to validate a UUID? Use `UUIDValidator` from Core.
- Need to throw an error? Throw a specific exception from `src/modules/core/exceptions`.
