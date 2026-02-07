import { createBrowserClient } from '@supabase/ssr'

// Safe client creation that doesn't throw during Vercel SSG build
export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // During build time, env vars might not be available
    // Return a mock client that won't be used anyway
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase environment variables not found - using mock client");
        // Return a minimal mock to prevent build errors
        // This will only happen during SSG, not at runtime
        return {
            auth: {
                getUser: async () => ({ data: { user: null }, error: null }),
                signOut: async () => ({ error: null }),
                signUp: async () => ({ data: { user: null, session: null }, error: { message: "Supabase not configured" } }),
                signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: "Supabase not configured" } }),
                signInWithOAuth: async () => ({ data: { provider: null, url: null }, error: { message: "Supabase not configured" } }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            },
        } as unknown as ReturnType<typeof createBrowserClient>
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
