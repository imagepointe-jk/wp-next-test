import {
  validateUserJwt,
  validateUserResponse,
} from "@/types/validation/wpgraphql";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};
export default async function Page({ params }: Props) {
  const { id: idFromUrl } = await params; //in next 15 params is now async
  const cookieStore = await cookies();
  const token = `${cookieStore.get("wp_jwt_auth")?.value}`;
  const tokenDecoded = jwtDecode(token);
  const jwtParsed = validateUserJwt(tokenDecoded);
  const idFromJwt = jwtParsed.data.user.id;
  const user = await fetch(process.env.WP_GRAPHQL_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
            query getUser {
              user(id:"${idFromUrl}") {
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
  const parsed = validateUserResponse(json);

  //deny access if the logged in user is trying to access someone else's page. Note that even if it is accessed, WPGraphQL will hide the other person's sensitive info like email.
  if (parsed.data?.user?.databaseId !== +idFromJwt) redirect("/access-denied");

  return (
    <>
      <h1>Hello {parsed.data?.user?.name || "UNKNOWN"}</h1>
      <div>Email: {parsed.data?.user?.email || "UNKNOWN"}</div>
    </>
  );
}
