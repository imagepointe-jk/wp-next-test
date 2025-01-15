import { cookies } from "next/headers";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { validateUserResponse } from "./types/validation/wpgraphql";
import { getUser } from "./fetch/wordpress";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const cookiesToken = cookieStore.get("wp_jwt_auth")?.value;
  const cookiesId = cookieStore.get("wp_user_id")?.value;
  console.log("tried to visit", request.url);

  try {
    if (!cookiesToken || !cookiesId)
      throw new Error("Missing token and/or user id in cookies.");

    //check if the user has any valid token. this does NOT care who the user is, as long as they have the token.
    await verifyToken(cookiesToken, cookiesId);
  } catch (error) {
    console.error(error);
    const url = new URL("/login", request.url);
    url.searchParams.append("redirect_to", encodeURIComponent(request.url));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: ["/users/:id*", "/restricted-route"],
};

async function verifyToken(cookiesToken: string, cookiesId: string) {
  const user = await getUser(cookiesToken, cookiesId);
  const json = await user.json();
  const parsedUserResponse = validateUserResponse(json);
  if (parsedUserResponse.errors !== undefined) {
    const tokenRejected = !!parsedUserResponse.errors.find((error) =>
      error.message.includes("cannot be accessed without authentication")
    );
    if (tokenRejected) throw new Error("The token was rejected.");
    else throw new Error("Unknown authentication error.");
  }
}
