import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            const { data: { user } } = await supabase.auth.getUser();
            // Check if user has any products
            const { data: products } = await supabase
                .from('user_products')
                .select('id')
                .eq('user_id', user?.id)
                .single(); // Use single/maybeSingle or limit(1) to check existence efficiently

            if (products) {
                return NextResponse.redirect(`${origin}/sede`)
            } else {
                return NextResponse.redirect(`${origin}/plans`)
            }
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
