import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your-project-url' || supabaseKey === 'your-anon-key') {
    throw new Error('Supabase environment variables not configured. Please update .env.local with your Supabase credentials.')
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}
