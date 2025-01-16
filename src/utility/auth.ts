import { NextResponse } from "next/server";

export function forceLogoutWithResponse(response: NextResponse) {
  response.cookies.set("wp_jwt_auth", "n/a", {
    expires: 0,
  });
  response.cookies.set("wp_user_id", "n/a", {
    expires: 0,
  });
}
