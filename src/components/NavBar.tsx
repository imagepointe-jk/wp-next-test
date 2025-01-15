// import { LogOutButton } from "./LogOutButton";

import Link from "next/link";

type Props = {
  user?: {
    name: string;
  };
};
export function NavBar({ user }: Props) {
  return (
    <nav style={{ display: "flex", justifyContent: "space-between" }}>
      <ul>
        <li>Link 1</li>
        <li>Link 2</li>
        <li>Link 3</li>
      </ul>
      <div>
        {user && <div>Hello {user.name}</div>}
        {!user && <Link href={"/login"}>Log In</Link>}
        {/* <LogOutButton /> */}
      </div>
    </nav>
  );
}
