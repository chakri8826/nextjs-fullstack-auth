import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Pages that should be accessible without login
  const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail' || path === '/forgotpassword' || path === '/resetpassword'

  const token = request.cookies.get('token')?.value || ''

  // If user is logged in and tries to access auth pages, redirect to home
  if ((path === '/login' || path === '/signup' || path === '/verifyemail' || path === '/forgotpassword' || path === '/resetpassword') && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  // If user is not logged in and tries to access protected pages, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/profile/:path*',
    '/signup',
    '/verifyemail',
    '/forgotpassword',
    '/resetpassword',
  ]
}