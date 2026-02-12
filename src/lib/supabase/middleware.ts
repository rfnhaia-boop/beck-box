import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Skip middleware for public routes
    const publicRoutes = ['/', '/login', '/auth']
    const isPublicRoute = publicRoutes.some(route =>
        request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith('/auth')
    )

    // For public routes, just pass through without auth check
    if (isPublicRoute) {
        return supabaseResponse
    }

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                        supabaseResponse = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        const {
            data: { user },
        } = await supabase.auth.getUser()

        // Protected routes - redirect to login if not authenticated
        const protectedRoutes = ['/dashboard', '/library', '/product', '/sede', '/client', '/settings']
        const isProtectedRoute = protectedRoutes.some(route =>
            request.nextUrl.pathname.startsWith(route)
        )

        if (isProtectedRoute && !user) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        return supabaseResponse
    } catch (error) {
        // If there's an error, just let the request through
        console.error('Middleware error:', error)
        return supabaseResponse
    }
}
