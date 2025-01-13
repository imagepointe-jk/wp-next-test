import { LogOutButton } from "./LogOutButton";

export function NavBar() {
  return (
    <nav style={{ display: "flex", justifyContent: "space-between" }}>
      <ul>
        <li>Link 1</li>
        <li>Link 2</li>
        <li>Link 3</li>
      </ul>
      <div>
        <LogOutButton />
      </div>
    </nav>
  );
}
