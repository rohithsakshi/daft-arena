import { NextRequest, NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  details?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    sub: string;
    email: string;
    [key: string]: any;
  };
}

export type AsyncRequestHandler = (
  req: AuthenticatedRequest,
  context?: any
) => Promise<NextResponse> | NextResponse;

export interface IAuditInfo {
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
}

export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export interface StandardFilter {
  isDeleted?: boolean;
  createdAt?: { $gte?: Date; $lte?: Date };
  [key: string]: any;
}
