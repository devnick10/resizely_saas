import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const pathname = request.nextUrl.pathname;

  const privateRoutes = [
    "/home",
    "/social-share",
    "/video-upload",
    "/bg-remover",
    "/order",
    "/verify",
    "/payment",
  ];

  const isProtectedRoutes = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!token && isProtectedRoutes) {
    return NextResponse.redirect(new URL("/sign-up", request.url));
  }
}

export const config = {
  matcher: [
    "/home",
    "/social-share",
    "/video-upload",
    "/bg-remover",
    "/api/order",
    "/api/verify",
    "/payment",
  ],
};
