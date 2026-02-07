import { createBrowserClient } from '@supabase/ssr'

// Safe client creation that doesn't throw during Vercel SSG build
export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // During build time, env vars might not be available
    // Return a mock client that won't be used anyway
    if (!supabaseUrl || !supabaseAnonKey) {
        // Return a minimal mock to prevent build errors
        // This will only happen during SSG, not at runtime
        return {
            auth: {
                getUser: async () => ({ data: { user: null }, error: null }),
                signOut: async () => ({ error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            },
        } as ReturnType<typeof createBrowserClient>
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
