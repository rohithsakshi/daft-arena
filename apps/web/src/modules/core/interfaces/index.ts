import { Document } from 'mongoose';

export interface Entity {
  id: string;
}

export interface TimestampedEntity {
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDelete {
  isDeleted: boolean;
  deletedAt?: Date;
}

export interface AuditInfo {
  createdBy?: string;
  updatedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface BaseEntity extends Entity, TimestampedEntity, SoftDelete, AuditInfo {
  version: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  data?: T | PaginatedResponse<T>;
  error?: string;
  message?: string;
  details?: any;
}

export interface AuthenticatedUser {
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
  [key: string]: any;
}
