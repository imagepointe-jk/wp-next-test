// import { queryWpGraphQl } from "./wpGraphQl";

//TODO: Make AuthButton
export function getUser(token: string, globalId: string) {
  return fetch(process.env.WP_GRAPHQL_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
            query getUser {
                user(id:"${globalId}") {
                    id
                    databaseId
                    email
                    name
                  }
                }
            `,
    }),
  });
}
