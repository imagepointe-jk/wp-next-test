"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onClick() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/logout`,
        {
          method: "POST",
        }
      );
      if (!response.ok) throw new Error("Error while logging out.");

      router.push("/");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <button onClick={onClick}>
      {!loading && "Log Out"}
      {loading && "Loading..."}
    </button>
  );
}
