import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await axios.post(
        "http://localhost:4000/login",
        { email, password },
        { withCredentials: true }
      );

      const user = res.data.user;

      if (!user || (!user.id && !user.Id)) {
        console.error("Login response missing user object:", res.data);
        alert("Login succeeded but user data missing in response");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");

      navigate("/profile");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-card__header">
          <div className="auth-card__brand">
            <div className="logo-wordmark">
              <span className="logo-wordmark__primary">Geno</span>
              <span className="logo-wordmark__accent">Connect</span>
            </div>
            <div>
              <h1 className="auth-card__title">Welcome back</h1>
              <p className="auth-card__subtitle">
                Sign in to access your dashboard.
              </p>
            </div>
          </div>
        </header>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-form__field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="auth-form__extras">
              <span className="auth-form__hint">Minimum 6 characters.</span>
              <button
                type="button"
                className="auth-form__link"
                // onClick={...} // reset flow later
              >
                Forgot password?
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="auth-form__error" role="alert">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="auth-form__submit"
            disabled={submitting}
          >
            {submitting ? "Signing you in…" : "Login"}
          </button>
        </form>

        <footer className="auth-card__footer">
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/register" className="auth-form__link">
              Register now
            </Link>
          </p>
        </footer>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: var(--bg-page-gradient, radial-gradient(circle at top, #1f2937 0, #020617 55%));
          font-family: var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          background: var(--bg-app, #020617);
          border-radius: var(--radius-xl, 18px);
          border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.5));
          box-shadow: var(--shadow-strong, 0 24px 60px rgba(15, 23, 42, 0.8));
          color: var(--text-main, #e5e7eb);
          padding: 24px 22px 20px;
        }

        .auth-card__header {
          margin-bottom: 18px;
        }

        .auth-card__brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .auth-card__title {
          margin: 0 0 2px;
          font-size: var(--font-size-xl, 20px);
          font-weight: 600;
        }

        .auth-card__subtitle {
          margin: 0;
          font-size: var(--font-size-sm, 12px);
          color: var(--text-muted, #9ca3af);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }

        .auth-form__field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .auth-form__field label {
          font-size: var(--font-size-sm, 12px);
          font-weight: 500;
        }

        .auth-form__field input {
          padding: 8px 10px;
          font-size: var(--font-size-md, 13px);
          border-radius: var(--radius-md, 10px);
          border: 1px solid rgba(51, 65, 85, 0.95);
          background: rgba(15, 23, 42, 0.9);
          color: var(--text-main, #e5e7eb);
          outline: none;
          transition: border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
        }

        .auth-form__field input::placeholder {
          color: rgba(148, 163, 184, 0.7);
        }

        .auth-form__field input:focus {
          border-color: rgba(129, 140, 248, 0.95);
          box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.7);
          background: #020617;
        }

        .auth-form__extras {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
          gap: 10px;
        }

        .auth-form__hint {
          font-size: var(--font-size-xs, 10px);
          color: var(--text-muted, #9ca3af);
        }

        .auth-form__link {
          font-size: var(--font-size-xs, 10px);
          color: #a5b4fc;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          text-decoration: underline;
          text-decoration-style: dotted;
        }

        .auth-form__error {
          margin: 0;
          font-size: var(--font-size-sm, 12px);
          color: #f97373;
        }

        .auth-form__submit {
          margin-top: 6px;
          border: none;
          border-radius: var(--radius-pill, 999px);
          padding: 9px 18px;
          font-size: var(--font-size-md, 13px);
          font-weight: 500;
          cursor: pointer;
          background: linear-gradient(
            135deg,
            var(--accent, #4f46e5),
            var(--accent-alt, #6366f1)
          );
          color: var(--text-main, #f9fafb);
          box-shadow: var(--shadow-soft, 0 16px 30px rgba(79, 70, 229, 0.65));
          transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease,
            opacity 0.1s ease;
          width: 100%;
        }

        .auth-form__submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 18px 40px rgba(79, 70, 229, 0.75);
        }

        .auth-form__submit:disabled {
          opacity: 0.75;
          cursor: default;
          box-shadow: none;
        }

        .auth-card__footer {
          margin-top: 16px;
          text-align: center;
          font-size: var(--font-size-sm, 12px);
          color: var(--text-muted, #9ca3af);
        }

        .logo-wordmark {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          padding: 4px 10px;
          border-radius: var(--radius-pill, 999px);
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.6));
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.8);
        }

        .logo-wordmark__primary {
          font-weight: 700;
          font-size: var(--font-size-lg, 16px);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-main, #e5e7eb);
        }

        .logo-wordmark__accent {
          font-weight: 600;
          font-size: var(--font-size-md, 13px);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: linear-gradient(
            135deg,
            var(--success, #22c55e),
            #4ade80
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 18px 16px 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
