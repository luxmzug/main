import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(12),
  SESSION_SECRET: z.string().min(32),
  DATABASE_PATH: z.string().min(1).default('data/luxusumzug.db'),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

/**
 * Returns validated environment variables. Reads process.env only here.
 */
export const getEnv = (): Env => {
  if (cached) {
    return cached;
  }

  cached = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    SESSION_SECRET: process.env.SESSION_SECRET,
    DATABASE_PATH: process.env.DATABASE_PATH,
  });

  return cached;
};
