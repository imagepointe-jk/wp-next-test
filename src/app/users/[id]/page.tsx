import { validateUserResponse } from "@/types/validation/wpgraphql";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{ id: string }>;
};
export default async function Page({ params }: Props) {
  const { id } = await params; //in next 15 params is now async
  const cookieStore = await cookies();
  const user = await fetch(process.env.WP_GRAPHQL_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookieStore.get("wp_jwt_auth")?.value}`,
    },
    body: JSON.stringify({
      query: `
            query getUser {
              user(id:"${id}") {
                id
                name
              }
            }
          `,
    }),
  });
  const json = await user.json();
  const parsed = validateUserResponse(json);

  return <h1>Hello {parsed.data?.user?.name || "UNKNOWN"}</h1>;
}
