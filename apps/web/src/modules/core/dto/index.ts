export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface SortingDto {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | '1' | '-1';
}

export interface FilteringDto {
  isActive?: boolean;
  isDeleted?: boolean;
  [key: string]: any;
}

export interface SearchDto {
  query?: string;
}

export interface DateRangeDto {
  startDate?: Date;
  endDate?: Date;
}

export interface QueryOptionsDto extends PaginationDto, SortingDto, SearchDto, FilteringDto, DateRangeDto {}

export interface AuditDto {
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
  action: string;
  resource: string;
  details?: any;
}

export interface ApprovalDto {
  status: 'Approved' | 'Rejected' | 'Escalated';
  reason?: string;
  approvedBy: string;
}

export interface MetadataDto {
  [key: string]: string | number | boolean | null;
}

export interface AddressDto {
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ContactDto {
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface FileUploadDto {
  filename: string;
  mimetype: string;
  size: number;
  url: string;
  key?: string; // S3 or storage key
}
