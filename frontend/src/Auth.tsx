
import { useState } from "react";
import { login, register } from "./api";

type AuthProps = {
  onAuthenticated: (name: string) => void;
};

function Auth({ onAuthenticated }: AuthProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = isRegistering
        ? await register(name, email, password)
        : await login(email, password);

      onAuthenticated(user.name);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>TaskBridge</h1>
        <p>
          {isRegistering
            ? "Create your account"
            : "Welcome back"}
        </p>

        {isRegistering && (
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={100}
              autoComplete="name"
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            maxLength={150}
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={isRegistering ? 8 : undefined}
            autoComplete={
              isRegistering ? "new-password" : "current-password"
            }
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isRegistering
              ? "Sign Up"
              : "Log In"}
        </button>

        <p className="auth-switch">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            className="auth-switch-button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
            }}
          >
            {isRegistering ? "Log In" : "Sign Up"}
          </button>
        </p>
      </form>
    </main>
  );
}

export default Auth;
