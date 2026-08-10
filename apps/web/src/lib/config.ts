import { z } from 'zod';

const envSchema = z.object({
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/daft-arena-dev'),
  JWT_SECRET: z.string().default('super_secret_development_jwt_key_that_is_long_enough'),
  JWT_REFRESH_SECRET: z.string().default('super_secret_development_jwt_refresh_key_that_is_long_enough'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SMTP_HOST: z.string().default(''),
  SMTP_PORT: z.string().default('587'),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  SMTP_FROM: z.string().default(''),
  CLOUDINARY_CLOUD_NAME: z.string().default(''),
  CLOUDINARY_API_KEY: z.string().default(''),
  CLOUDINARY_API_SECRET: z.string().default(''),
  SUPER_ADMIN_NAME: z.string().default('daftlabs'),
  SUPER_ADMIN_EMAIL: z.string().default('daftlabs.reply@gmail.com'),
  SUPER_ADMIN_PASSWORD: z.string().default('daftlabs'),
  GOOGLE_CLIENT_ID: z.string().default(''),
  GOOGLE_CLIENT_SECRET: z.string().default(''),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.warn('⚠️ Invalid or missing environment variables:', _env.error.format());
}

export const config = _env.success ? _env.data : {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/daft-arena-dev',
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_development_jwt_key_that_is_long_enough',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'super_secret_development_jwt_refresh_key_that_is_long_enough',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT || '587',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || '',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  SUPER_ADMIN_NAME: process.env.SUPER_ADMIN_NAME || 'daftlabs',
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL || 'daftlabs.reply@gmail.com',
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD || 'daftlabs',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
};
