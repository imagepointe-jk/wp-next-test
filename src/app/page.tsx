"use client";

export default function Home() {
  async function clickUpdate() {
    console.log("sending");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: "test description",
        }),
      }
    );
    const json = await response.json();
    console.log(json);
  }

  async function clickLogIn() {
    console.log("sending log in", process.env.NEXT_PUBLIC_SERVER_URL);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: process.env.NEXT_PUBLIC_WORDPRESS_USERNAME,
          password: process.env.NEXT_PUBLIC_WORDPRESS_PASSWORD,
        }),
      }
    );
    const json = await response.json();
    console.log(json);
  }

  return (
    <>
      <h1>WordPress Next.js Testing</h1>
      <div>
        <button onClick={clickLogIn}>Log In</button>
        <button onClick={clickUpdate}>Update</button>
      </div>
    </>
  );
}
