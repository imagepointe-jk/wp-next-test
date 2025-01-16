import { getUser } from "@/fetch/wordpress";
import {
  validateUserJwt,
  validateUserResponse,
} from "@/types/validation/wpgraphql";
import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";

export function forceLogoutWithResponse(response: NextResponse) {
  response.cookies.set("wp_jwt_auth", "n/a", {
    expires: 0,
  });
  response.cookies.set("wp_user_id", "n/a", {
    expires: 0,
  });
}

//uses the given token to make an authenticated request for the given user (by the WordPress global id string).
//if the user data received contains the same (numberic) databaseId as the token, then this token belongs to the given user.
export async function checkTokenAgainstUser(
  token: string,
  userGlobalId: string
) {
  const tokenDecoded = jwtDecode(token);
  const tokenParsed = validateUserJwt(tokenDecoded);
  const idFromToken = +tokenParsed.data.user.id;

  const userResponse = await getUser(token, userGlobalId);
  const userJson = await userResponse.json();
  const userParsed = validateUserResponse(userJson);
  const userIdFromDatabase = userParsed.data?.user?.databaseId;

  return {
    idFromToken,
    user: userParsed,
    match:
      userIdFromDatabase !== undefined && userIdFromDatabase === idFromToken,
  };
}
