import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const jwt = request.cookies.get("wp_jwt_auth");

  console.log("using jwt", jwt);
  const updateResponse = await fetch(process.env.WP_GRAPHQL_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt?.value}`,
    },
    body: JSON.stringify({
      query: `
        mutation UpdateUser {
            updateUser( input: {
                id: "dXNlcjozODAy",
                description: "test description 2"
            } ) {
                user {
                    id
                    name
                    description
                }
            }
        }
        `,
    }),
  });
  const updateJson = await updateResponse.json();
  console.log(updateJson);

  return Response.json({ message: "hi again" });
}
