import { z } from 'zod';
import { TournamentStatus, RegistrationStatus, ApprovalStatus, MatchStatus } from '../enums';

export const StatusEnumValidator = z.enum([
  'ACTIVE', 'INACTIVE', 'PENDING', 'ARCHIVED'
]);

// Primitive Validators
export const EmailValidator = z.string().email('Invalid email address');

// Very basic phone validation
export const PhoneValidator = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

export const UUIDValidator = z.string().uuid('Invalid UUID format');

export const ObjectIdValidator = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId');

export const BooleanStringValidator = z.union([
  z.boolean(),
  z.string().transform((val) => val.toLowerCase() === 'true')
]);

// Complex Validators
export const PaginationValidator = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10)
});

export const SortingValidator = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc', '1', '-1']).optional().default('desc')
}).transform((data) => {
  if (!data.sortBy) return undefined;
  const order = data.sortOrder === 'asc' || data.sortOrder === '1' ? 1 : -1;
  return { [data.sortBy]: order };
});

export const SearchValidator = z.object({
  query: z.string().optional().default('')
});

export const DateRangeValidator = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional()
}).refine(data => {
  if (data.startDate && data.endDate) {
    return data.startDate <= data.endDate;
  }
  return true;
}, { message: "End date cannot be earlier than start date", path: ["endDate"] });

export const FilteringValidator = z.record(z.string(), z.any());
