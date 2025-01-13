import { cookies } from "next/headers";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { validateUserResponse } from "./types/validation/wpgraphql";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("wp_jwt_auth");
  const idCookie = cookieStore.get("wp_user_id");
  const user = await fetch(process.env.WP_GRAPHQL_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authCookie?.value}`,
    },
    body: JSON.stringify({
      query: `
          query getUser {
            user(id:"${idCookie?.value}") {
              id
              name
            }
          }
        `,
    }),
  });
  const json = await user.json();
  const parsed = validateUserResponse(json);

  const authenticated = !parsed.errors?.find((error) =>
    error.message.includes("cannot be accessed without authentication")
  );
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
