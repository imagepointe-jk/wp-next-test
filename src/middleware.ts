import { cookies } from "next/headers";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import {
  validateUserJwt,
  validateUserResponse,
} from "./types/validation/wpgraphql";
import { jwtDecode } from "jwt-decode";
import { AuthError } from "./types/error";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const cookiesToken = cookieStore.get("wp_jwt_auth")?.value;
  const cookiesId = cookieStore.get("wp_user_id")?.value;

  try {
    if (!cookiesToken || !cookiesId)
      throw new AuthError(
        "NOT_AUTHENTICATED",
        "Missing token and/or user id in cookies."
      );

    verifyCookies(cookiesToken, cookiesId);
  } catch (error) {
    if (error instanceof AuthError) {
      console.error(error.serverMessage);
      if (error.type === "ACCESS_DENIED") {
        return redirect("/access-denied", request);
      } else {
        return redirect("/login", request);
      }
    } else {
      return redirect("/login", request);
    }
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: ["/users/:id*"],
};

function redirect(path: string, request: NextRequest) {
  const url = new URL(path, request.url);
  return NextResponse.redirect(url);
}

async function verifyCookies(cookiesToken: string, cookiesId: string) {
  const user = await fetch(process.env.WP_GRAPHQL_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookiesToken}`,
    },
    body: JSON.stringify({
      query: `
            query getUser {
              user(id:"${cookiesId}") {
                id
                databaseId
                email
                name
              }
            }
          `,
    }),
  });
  const json = await user.json();
  const parsedUserResponse = validateUserResponse(json);
  const jwtDecoded = jwtDecode(cookiesToken);
  const jwtParsed = validateUserJwt(jwtDecoded);
  const idFromDatabase = parsedUserResponse.data?.user?.databaseId;
  const idFromJwt = +jwtParsed.data.user.id;

  if (parsedUserResponse.errors !== undefined) {
    if (
      parsedUserResponse.errors.find((error) =>
        error.message.includes("cannot be accessed without authentication")
      )
    )
      throw new AuthError("NOT_AUTHENTICATED", "The token was rejected.");
    throw new AuthError("NOT_AUTHENTICATED");
  }
  //deny access if the logged in user is trying to access someone else's page. Note that even if it is accessed, WPGraphQL will hide the other person's sensitive info like email.
  if (idFromDatabase !== idFromJwt) {
    throw new AuthError(
      "ACCESS_DENIED",
      "The ID in the provided token did not match the ID of the user that the token granted us access to."
    );
  }
}
