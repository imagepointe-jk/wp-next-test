"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { z } from "zod";

export default function Page() {
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
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
    const schema = z.object({
      id: z.string(),
      name: z.string(),
      databaseId: z.number(),
    });
    const parsed = schema.parse(json);
    router.push(`/users/${parsed.id}`);
  }

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
    </>
  );
}
