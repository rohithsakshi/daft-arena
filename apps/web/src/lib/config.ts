import { z } from 'zod';

const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.warn('⚠️ Invalid or missing environment variables (this is expected during Vercel build phase):', _env.error.format());
}

export const config = _env.success ? _env.data : {
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
};
