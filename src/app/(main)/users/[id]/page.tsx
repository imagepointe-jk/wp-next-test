import { checkTokenAgainstUser } from "@/utility/auth";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};
export default async function Page({ params }: Props) {
  const { id: idFromUrl } = await params; //in next 15 params is now async
  const cookieStore = await cookies();

  const token = `${cookieStore.get("wp_jwt_auth")?.value}`;
  const { match: tokenBelongsToRequestedUser, user } =
    await checkTokenAgainstUser(token, idFromUrl);

  //deny access if the logged in user is trying to access someone else's page. Note that even if it is accessed, WPGraphQL will hide the other person's sensitive info like email.
  if (!tokenBelongsToRequestedUser) redirect("/access-denied");

  return (
    <>
      <h1>Hello {user.data?.user?.name || "UNKNOWN"}</h1>
      <div>Email: {user.data?.user?.email || "UNKNOWN"}</div>
    </>
  );
}
