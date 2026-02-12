import { createClient } from '@supabase/supabase-js'

export const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing from .env.local')
    }

    if (!supabaseServiceKey || supabaseServiceKey === 'COLE_SUA_SERVICE_ROLE_KEY_AQUI') {
        throw new Error(
            'SUPABASE_SERVICE_ROLE_KEY is missing or not configured in .env.local. ' +
            'Go to your Supabase Dashboard > Project Settings > API > service_role key and paste it in your .env.local file.'
        )
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
