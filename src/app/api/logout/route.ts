import { forceLogoutWithResponse } from "@/utility/auth";
import { NextResponse } from "next/server";

export function POST() {
  const response = NextResponse.json({ message: "Logged out." });
  forceLogoutWithResponse(response);

  return response;
}
