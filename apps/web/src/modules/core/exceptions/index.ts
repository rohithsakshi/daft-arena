export class BaseException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationException extends BaseException {
  constructor(message: string = 'Validation failed', details?: any) {
    super(400, message, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationException extends BaseException {
  constructor(message: string = 'Authentication required') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class AuthorizationException extends BaseException {
  constructor(message: string = 'Access denied') {
    super(403, message, 'FORBIDDEN');
  }
}

export class NotFoundException extends BaseException {
  constructor(resource: string = 'Resource', details?: any) {
    super(404, `${resource} not found`, 'NOT_FOUND', details);
  }
}

export class ConflictException extends BaseException {
  constructor(message: string = 'Resource conflict', details?: any) {
    super(409, message, 'CONFLICT', details);
  }
}

export class BusinessRuleException extends BaseException {
  constructor(message: string = 'Business rule violation', details?: any) {
    super(422, message, 'BUSINESS_RULE_VIOLATION', details);
  }
}
