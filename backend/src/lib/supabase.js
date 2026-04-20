import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '[supabase] WARNING: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. ' +
    'Database operations will fail. Set env vars before using DB endpoints.'
  );
}

export const supabase = createClient(
  process.env.SUPABASE_URL ?? 'http://localhost',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);
