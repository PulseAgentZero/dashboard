import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// NEXT_PUBLIC_* vars are baked in at build time, so this evaluates once per build.
const SELF_HOSTED = process.env.NEXT_PUBLIC_DEPLOYMENT_MODE === "self_hosted";

export function proxy(request: NextRequest) {
  // In self-hosted mode the landing page is irrelevant — send users straight to login.
  if (SELF_HOSTED && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: "/",
};
