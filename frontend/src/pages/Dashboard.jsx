import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  async function handleSignout() {
    await signout();
    navigate("/");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}</p>
      <p>{user.email}</p>
      <button onClick={handleSignout}>Sign out</button>
    </div>
  );
}
