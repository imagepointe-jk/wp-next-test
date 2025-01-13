export default function Page() {
  return (
    <>
      <h1>Restricted Route</h1>
      <p>
        This route is restricted to authenticated users by middleware, but does
        not care who the authenticated user is. As long as they have any valid
        token, they have access.
      </p>
    </>
  );
}
