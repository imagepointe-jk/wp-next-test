import { cookies } from "next/headers";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { validateUserResponse } from "./types/validation/wpgraphql";
import { getUser } from "./fetch/wordpress";
import { NextURL } from "next/dist/server/web/next-url";
import { forceLogoutWithResponse } from "./utility/auth";

export async function middleware(request: NextRequest) {
  const requestedLogout =
    request.nextUrl.pathname === "/login" &&
    request.nextUrl.searchParams.get("action") === "logout";
  if (requestedLogout) {
    //the user requested a logout, so don't worry about anything else.
    const response = NextResponse.next();
    forceLogoutWithResponse(response);
    return response;
  }

  const cookieStore = await cookies();
  const cookiesToken = cookieStore.get("wp_jwt_auth")?.value;
  const cookiesId = cookieStore.get("wp_user_id")?.value;

  //were the token and user id both provided?
  if (!cookiesToken || !cookiesId) {
    //if not, and this isn't a protected route, don't worry about it
    if (!isPageProtected(request.nextUrl)) {
      return NextResponse.next();
    }
    //if not, and this IS a protected route, redirect to login.
    //also use logout to clean up one or the other if only one was provided.
    const url = new URL("/login", request.url);
    url.searchParams.append("redirect_to", encodeURIComponent(request.url));
    const response = NextResponse.redirect(url);
    forceLogoutWithResponse(response);
    return response;
  }

  try {
    //the token and user id were both provided, so try to verify the token.
    //if this succeeds, we get a new token valid for another X minutes, allowing the user to stay logged in for longer than the initial token's lifetime.
    const newToken = await verifyToken(cookiesToken, cookiesId);
    const response = NextResponse.next();
    if (newToken)
      response.cookies.set("wp_jwt_auth", newToken, { httpOnly: true });

    return response;
  } catch (error) {
    console.error(error);

    //we weren't able to verify the token.
    if (!isPageProtected(request.nextUrl)) {
      //if this isn't a protected route, don't worry about it.
      //BUT use logout to clean up the token and id since there's probably something wrong with one or both of them.
      const response = NextResponse.next();
      forceLogoutWithResponse(response);
      return response;
    }

    //this is a protected route, so redirect to login.
    //ALSO use logout to clean up the token and id since there's probably something wrong with one or both of them.
    const url = new URL("/login", request.url);
    url.searchParams.append("redirect_to", encodeURIComponent(request.url));
    const response = NextResponse.redirect(url);
    forceLogoutWithResponse(response);
    return response;
  }
}

//run middleware for pretty much everything.
//we'll decide inside the middleware logic what runs for what route.
export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

function isPageProtected(url: NextURL) {
  const protectedRoutes = ["/users", "/restricted-route"];
  const isProtected = !!protectedRoutes.find((route) =>
    url.pathname.startsWith(route)
  );
  return isProtected;
}

async function verifyToken(cookiesToken: string, cookiesId: string) {
  //verify by making a simple request to get the user by id.
  const user = await getUser(cookiesToken, cookiesId);
  //a successful request includes a new token valid for another X minutes, allowing the user to stay logged in for longer than the initial token's lifetime.
  const newToken = user.headers.get("x-jwt-auth");
  const json = await user.json();
  const parsedUserResponse = validateUserResponse(json);
  if (parsedUserResponse.errors !== undefined) {
    const tokenRejected = !!parsedUserResponse.errors.find((error) =>
      error.message.includes("cannot be accessed without authentication")
    );
    if (tokenRejected) throw new Error("The token was rejected.");
    else throw new Error("Unknown authentication error.");
  }
  return newToken;
}
