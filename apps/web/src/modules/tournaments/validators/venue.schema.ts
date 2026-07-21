import { z } from 'zod';

export const AddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  zipCode: z.string().min(1)
});

export const GeoLocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180)
});

export const CreateVenueSchema = z.object({
  name: z.string().min(1),
  organizationId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Organization ID').optional(),
  address: AddressSchema,
  geoLocation: GeoLocationSchema.optional(),
  timezone: z.string().min(1),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional()
});

export const UpdateVenueSchema = CreateVenueSchema.partial();

export const CreatePlayingAreaSchema = z.object({
  venueId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Venue ID'),
  name: z.string().min(1),
  type: z.string().min(1),
  surface: z.string().optional(),
  isAvailable: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export const UpdatePlayingAreaSchema = CreatePlayingAreaSchema.partial();
