import { createClient } from '@supabase/supabase-js';

// These should be environment variables in a real app.
// For the sake of the exercise, we fallback to dummy values if not provided.
// To use a real Supabase instance, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
