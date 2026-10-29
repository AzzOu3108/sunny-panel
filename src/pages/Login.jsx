import { Link, useNavigate } from "@tanstack/react-router";
import logo from "../assets/Landing-assets/All-Logos/logo.svg";
import { useState } from "react";
import api, { getErrorMessage, setTokens } from "../lib/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (!data.accessToken || !data.refreshToken) {
        throw new Error("The login response did not include authentication tokens.");
      }
      setTokens(data.accessToken, data.refreshToken);
      await navigate({ to: "/dashboard" });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to log in. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="auth-page">
      <Link to="/" className="back-link">
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </Link>

      <div className="auth-container">
        <div className="auth-text-section">
          <h1>
            Welcome Back! Let's
            <br />
            Get Back to Managing.
          </h1>
          <p>
            Transform the way your team plans, collaborates,
            <br />
            and achieves success.
          </p>
        </div>

        <div className="auth-form-section">
          <div className="auth-form-card">
            <div className="logo-container">
              <img src={logo} alt="Manag'it" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Exemple@gmail.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="**************"
                    autoComplete="current-password"
                    required
                  />
                  <div className="input-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                </div>
              </div>

              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}

              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Logging in..." : "Login"}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              <div className="auth-switch">
                You don't have an account ? <Link to="/signup">Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
