import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoutes = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
]);

const isPublicApiRoute = createRouteMatcher([
    "/api/webhooks/signup",  
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    const currentUrl = new URL(req.url);

    const isAccessingVideoUpload = currentUrl.pathname === '/video-upload';

    // Allow access to all public routes without authentication
    if (isPublicRoutes(req) || isPublicApiRoute(req)) {
        return NextResponse.next();
    }

    // Restrict /video-upload to authenticated users
    if (isAccessingVideoUpload && !userId) {
        return NextResponse.redirect(new URL('/sign-up', req.url));
    }

    // Redirect unauthenticated users trying to access private pages
    if (!userId && !isPublicRoutes(req) && !isPublicApiRoute(req)) {
        return NextResponse.redirect(new URL('/sign-up', req.url));
    }

    return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
