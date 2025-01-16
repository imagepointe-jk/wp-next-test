import { NavBar } from "@/components/NavBar";
import { getUser } from "@/fetch/wordpress";
import { validateUserResponse } from "@/types/validation/wpgraphql";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export default async function NormalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookiesStore = await cookies();
  const user = await getLoggedInUser(cookiesStore);

  return (
    <>
      <NavBar user={user} /> {children}
    </>
  );
}

async function getLoggedInUser(cookies: ReadonlyRequestCookies) {
  const token = cookies.get("wp_jwt_auth")?.value;
  const id = cookies.get("wp_user_id")?.value;
  try {
    if (!token || !id) throw new Error();
    const userResponse = await getUser(token, id);
    const userJson = await userResponse.json();
    const parsed = validateUserResponse(userJson);
    if (!parsed.data?.user) throw new Error();
    return {
      name: parsed.data.user.name,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return undefined;
  }
}
