import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authCookie = request.cookies.get("pb_auth");
  let isAuthenticated = false;
  let isSuperuser = false;

  if (authCookie?.value) {
    try {
      const decoded = decodeURIComponent(authCookie.value);
      const auth = JSON.parse(decoded);
      isAuthenticated = !!auth.token;
      isSuperuser = auth.record?.collectionName === "_superusers";
    } catch {
      // invalid cookie — treat as unauthenticated
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (isSuperuser) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
