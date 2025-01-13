import { NextResponse } from "next/server";

export function POST() {
  const response = NextResponse.json({ message: "Logged out." });
  response.cookies.set("wp_jwt_auth", "n/a", {
    expires: 0,
  });
  response.cookies.set("wp_user_id", "n/a", {
    expires: 0,
  });

  return response;
}
