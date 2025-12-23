import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;
  // Routes that REQUIRE authentication
  const privateRoutes = [
    "/home",
    "/social-share",
    "/video-upload",
    "/bg-remover",
    "/order",
    "/verify",
    "/payment",
  ];
  
  // Routes that should NOT be accessible when logged in
  const publicAuthRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
  ];

  const isProtectedRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthPage = publicAuthRoutes.includes(pathname);

  if (!token && isProtectedRoute) {
    const url = new URL("/sign-up", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/home", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    
    "/home/:path*",
    "/social-share/:path*",
    "/video-upload/:path*",
    "/bg-remover/:path*",
    "/order/:path*",
    "/verify/:path*",
    "/payment/:path*",
  ],
};
