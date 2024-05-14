//middleware.ts
import { NextRequest, NextResponse } from 'next/server'

// 1. Specify protected and public routes
const protectedClientRoutes = ['/client']
const protectedAdminRoutes = ['/admin']
const publicRoutes = ['/login', '/signup', '/']

export default async function middleware(request: NextRequest) {
    // 1. Get pathname from request url
    const path = request.nextUrl.pathname

    // 2. Check if the current route is protected or public
    const isProtectedClientRoute = protectedClientRoutes.some(route => path.startsWith(route))
    const isProtectedAdminRoute = protectedAdminRoutes.some(route => path.startsWith(route))
    const isPublicRoute = publicRoutes.includes(path)

    // 3. Get session from the cookie
    const cookie = request.cookies.get("session")?.value || "{}";
    const session: Session = await JSON.parse(cookie);

    // 4. Redirect to /login if the user is not authenticated
    if ((isProtectedClientRoute || isProtectedAdminRoute) && !session?.access_token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }

    // 5. Redirect to /dashboard if the user is authenticated
    if (
        isPublicRoute &&
        session?.access_token &&
        !request.nextUrl.pathname.startsWith('/dashboard')
    ) {
        return NextResponse.redirect(new URL(session.redirectTo, request.nextUrl))
    }
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.\\.png$).)'],
}
