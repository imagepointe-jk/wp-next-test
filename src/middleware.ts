import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("wp_jwt_auth");
  const decoded = jwtDecode(authCookie?.value || "");
  console.log("Decoded", decoded);
  const authenticated = false;
  if (!authenticated) {
    const url = new URL("/login", request.url);
    console.log("redirect", url, "created from", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: ["/users/:id*"],
};
