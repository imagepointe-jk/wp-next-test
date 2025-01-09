import { NextRequest, NextResponse } from "next/server";
import { inspect } from "util";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const jwtResponse = await fetch(process.env.WP_GRAPHQL_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
          mutation LoginUser {
            login( input: {
              username: "${body.username}",
              password: "${body.password}"
            } ) {
              authToken
              user {
                id
                name
              }
            }
          }
        `,
    }),
  });
  const jwtJson = await jwtResponse.json();

  console.log(inspect(jwtJson, false, null));

  const response = NextResponse.json({ message: "hi" });
  response.cookies.set("wp_jwt_auth", jwtJson.data.login.authToken, {
    httpOnly: true,
  });

  return response;
}
