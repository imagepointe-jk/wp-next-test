import { NavBar } from "@/components/NavBar";
import { getUser } from "@/fetch/wordpress";
import { validateUserResponse } from "@/types/validation/wpgraphql";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export default async function NormalLayout({
  children,
}: {
  children: ReactNode;
}) {
  let user: { name: string } | undefined = undefined;
  const cookiesStore = await cookies();
  const token = cookiesStore.get("wp_jwt_auth")?.value;
  const id = cookiesStore.get("wp_user_id")?.value;
  try {
    if (!token || !id) throw new Error();
    const userResponse = await getUser(token, id);
    const userJson = await userResponse.json();
    const parsed = validateUserResponse(userJson);
    user = {
      name: parsed.data?.user?.name || "UNKNOWN",
    };
  } catch (error) {} // eslint-disable-line @typescript-eslint/no-unused-vars

  return (
    <>
      <NavBar user={user} /> {children}
    </>
  );
}
