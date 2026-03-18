import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome</h1>
      {user ? (
        <div>
          <p>You are signed in as {user.name}.</p>
          <Link to="/dashboard">Go to dashboard</Link>
        </div>
      ) : (
        <div>
          <Link to="/signin">Sign in</Link>
          <span> · </span>
          <Link to="/signup">Sign up</Link>
        </div>
      )}
    </div>
  );
}
