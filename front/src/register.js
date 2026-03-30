import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      await axios.post("http://localhost:4000/register", {
        firstname,
        lastname,
        email,
        password,
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
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
              <h1 className="auth-card__title">Create an account</h1>
              <p className="auth-card__subtitle">
                Register once, then sign in securely anytime.
              </p>
            </div>
          </div>
        </header>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="auth-form__row">
            <div className="auth-form__field">
              <label htmlFor="firstname">First name</label>
              <input
                id="firstname"
                type="text"
                placeholder="First name"
                autoComplete="given-name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>

            <div className="auth-form__field">
              <label htmlFor="lastname">Last name</label>
              <input
                id="lastname"
                type="text"
                placeholder="Last name"
                autoComplete="family-name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>
          </div>

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
              placeholder="Create a strong password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <p className="auth-form__hint">
              Use at least 8 characters with a mix of letters and numbers.
            </p>
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
            {submitting ? "Creating your account…" : "Register"}
          </button>
        </form>

        <footer className="auth-card__footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-form__link">
              Login now
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
          background: var(
            --bg-page-gradient,
            radial-gradient(circle at top, #1f2937 0, #020617 55%)
          );
          font-family: var(
            --font-sans,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif
          );
        }

        .auth-card {
          width: 100%;
          max-width: 480px;
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

        .auth-form__row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .auth-form__field {
          flex: 1 1 0;
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
          transition: border-color 0.16s ease, box-shadow 0.16s ease,
            background 0.16s ease;
        }

        .auth-form__field input::placeholder {
          color: rgba(148, 163, 184, 0.7);
        }

        .auth-form__field input:focus {
          border-color: rgba(129, 140, 248, 0.95);
          box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.7);
          background: #020617;
        }

        .auth-form__hint {
          font-size: var(--font-size-xs, 10px);
          color: var(--text-muted, #9ca3af);
          margin-top: 2px;
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
          transition: transform 0.1s ease, box-shadow 0.1s ease,
            background 0.1s ease, opacity 0.1s ease;
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

        .auth-form__link {
          font-size: var(--font-size-sm, 12px);
          color: #a5b4fc;
          text-decoration: underline;
          text-decoration-style: dotted;
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

          .auth-form__row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default RegisterPage;
