import Nav from "./nav";
import { getUser } from "./api/logto/user/get-user";

export default async function Home() {
  const user = await getUser();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Nav isAuthenticated={user.isAuthenticated} />
      {user.isAuthenticated && user.claims && (
        <div>
          <h2>Claims:</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(user.claims).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
