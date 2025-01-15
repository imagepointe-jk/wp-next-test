"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as string | null);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.get("username"),
            password: formData.get("password"),
          }),
        }
      );
      const json = await response.json();
      if (!response.ok)
        throw new Error(
          `Response ${response.status}: ${json.message || "Unknown error"}`
        );
      if (!json.id) throw new Error("Invalid id received from API");

      router.push(`/users/${json.id}`);
    } catch (error) {
      console.error(error);
      setError("Login failed.");
      setLoading(false);
    }
  }

  async function logout() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/logout`,
        {
          method: "POST",
        }
      );
      if (!response.ok) throw new Error("Error while logging out.");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "logout") logout();
  }, []);

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="username">
            Username
            <input type="text" name="username" id="username" />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            Password
            <input type="password" name="password" id="password" />
          </label>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      {loading && <div>Logging in...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </>
  );
}
