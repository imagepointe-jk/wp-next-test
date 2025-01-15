export async function queryWpGraphQl(cb: () => Promise<Response>) {
  try {
    const response = await cb();
    //WPGraphQL returns a 200 status even when there are errors.
    //read the JSON from a clone of the response so the original one's body is not consumed just for error checking.
    const clone = response.clone();
    const json = await clone.json();
    const errors = json.errors;
    if (Array.isArray(errors)) {
      throw new Error(`WPGraphQL errors: ${JSON.stringify(errors)}`);
    }
    return response;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unknown error.");
  }
}
