import { cookies } from "next/headers";

type Props = {
  params: Promise<{ id: string }>;
};
export default async function Page({ params }: Props) {
  const { id } = await params; //in next 15 params is now async
  const cookieStore = await cookies();

  return (
    <h1>
      Viewing user {id} with cookie {cookieStore.get("wp_jwt_auth")?.value}
    </h1>
  );
}
