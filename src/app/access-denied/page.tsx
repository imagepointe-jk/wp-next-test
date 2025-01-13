import { Metadata } from "next";

export default function Page() {
  return <h1>Access denied.</h1>;
}

export const metadata: Metadata = {
  title: "Access Denied",
  robots: {
    index: false,
    follow: false,
  },
};
