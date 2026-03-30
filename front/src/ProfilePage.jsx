import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const authed = localStorage.getItem("isAuthenticated") === "true";
    if (!authed) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:4000/profile", {
          withCredentials: true,
        });
        setProfile(res.data);
        setFirstname(res.data.first_name || "");
        setLastname(res.data.last_name || "");
        setEmail(res.data.email || "");
      } catch (err) {
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    try {
      await axios.put(
        "http://localhost:4000/profile",
        { firstname, lastname, email },
        { withCredentials: true }
      );
      alert("Profile updated");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/logout",
        {},
        { withCredentials: true }
      );
    } catch {
      alert("Logout failed");
    }
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  if (!profile) {
    return (
      <div className="profile-page profile-page--loading">
        <div className="profile-card">
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <header className="profile-card__header">
          <div className="logo-wordmark">
            <span className="logo-wordmark__primary">Geno</span>
            <span className="logo-wordmark__accent">Connect</span>
          </div>
          <div>
            <h1 className="profile-card__title">
              {firstname || profile.first_name} {lastname || profile.last_name}
            </h1>
            <p className="profile-card__subtitle">Account & profile settings</p>
          </div>
          <button
            type="button"
            className="profile-card__logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <section className="profile-card__section">
          <h2 className="profile-card__section-title">Personal information</h2>
          <p className="profile-card__section-description">
            Update the name and email associated with your account.
          </p>

          <form className="profile-form" onSubmit={handleUpdate}>
            <div className="profile-form__row">
              <div className="profile-form__field">
                <label htmlFor="firstname">First name</label>
                <input
                  id="firstname"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className="profile-form__field">
                <label htmlFor="lastname">Last name</label>
                <input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Last name"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>

            <div className="profile-form__field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            {errorMsg && (
              <p className="profile-form__error" role="alert">
                {errorMsg}
              </p>
            )}

            <div className="profile-form__actions">
              <button
                type="submit"
                className="profile-form__save"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
              <span className="profile-form__hint">
                Changes will apply to all sessions.
              </span>
            </div>
          </form>
        </section>
      </div>

      <style jsx>{`
        .profile-page {
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

        .profile-page--loading .profile-card {
          max-width: 420px;
        }

        .profile-card {
          width: 100%;
          max-width: 720px;
          background: var(--bg-app, #020617);
          border-radius: var(--radius-xl, 18px);
          border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.5));
          box-shadow: var(--shadow-strong, 0 24px 60px rgba(15, 23, 42, 0.8));
          color: var(--text-main, #e5e7eb);
          padding: 24px 24px 20px;
        }

        .profile-card__header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
        }

        .profile-card__title {
          margin: 0;
          font-size: var(--font-size-xl, 20px);
          font-weight: 600;
        }

        .profile-card__subtitle {
          margin: 2px 0 0;
          font-size: var(--font-size-sm, 12px);
          color: var(--text-muted, #9ca3af);
        }

        .profile-card__logout {
          margin-left: auto;
          border-radius: var(--radius-pill, 999px);
          border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.7));
          background: transparent;
          color: var(--text-main, #e5e7eb);
          padding: 6px 12px;
          font-size: var(--font-size-sm, 12px);
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease,
            transform 0.1s ease;
        }

        .profile-card__logout:hover {
          background: rgba(15, 23, 42, 0.9);
          border-color: rgba(148, 163, 184, 1);
          transform: translateY(-0.5px);
        }

        .profile-card__section {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid var(--border-strong, rgba(31, 41, 55, 0.9));
        }

        .profile-card__section-title {
          margin: 0 0 4px;
          font-size: 15px;
          font-weight: 500;
        }

        .profile-card__section-description {
          margin: 0 0 16px;
          font-size: var(--font-size-sm, 12px);
          color: var(--text-muted, #9ca3af);
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .profile-form__row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .profile-form__field {
          flex: 1 1 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .profile-form__field label {
          font-size: var(--font-size-sm, 12px);
          font-weight: 500;
        }

        .profile-form__field input {
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

        .profile-form__field input::placeholder {
          color: rgba(148, 163, 184, 0.7);
        }

        .profile-form__field input:focus {
          border-color: rgba(129, 140, 248, 0.95);
          box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.7);
          background: #020617;
        }

        .profile-form__error {
          margin: 0;
          font-size: var(--font-size-sm, 12px);
          color: #f97373;
        }

        .profile-form__actions {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .profile-form__save {
          border: none;
          border-radius: var(--radius-pill, 999px);
          padding: 8px 18px;
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
        }

        .profile-form__save:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 18px 40px rgba(79, 70, 229, 0.75);
        }

        .profile-form__save:disabled {
          opacity: 0.75;
          cursor: default;
          box-shadow: none;
        }

        .profile-form__hint {
          font-size: var(--font-size-xs, 10px);
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

        @media (max-width: 640px) {
          .profile-card {
            padding: 18px 16px 16px;
          }

          .profile-card__header {
            align-items: flex-start;
          }

          .profile-card__logout {
            font-size: var(--font-size-xs, 10px);
            padding: 5px 10px;
          }

          .profile-form__row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;
