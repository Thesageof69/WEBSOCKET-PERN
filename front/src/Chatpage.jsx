import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChatPage() {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const navigate = useNavigate();

  // Logged-in user from localStorage (shape from loginUser controller)
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = Number(currentUser.id);
  const currentUserName =
    currentUser.first_name ??
    currentUser.FirstName ??
    currentUser.firstname ??
    "";

  // Helper: load users with hasUnread flag
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/users", {
        withCredentials: true,
      });
      const list = res.data.users || res.data;
      setUsers(list.filter((u) => u.id !== currentUserId));
    } catch (err) {
      console.error("Failed to load users", err);
    }
  }, [currentUserId]);

  // Auth guard
  useEffect(() => {
    const authed = localStorage.getItem("isAuthenticated") === "true";
    if (!authed) navigate("/login");
  }, [navigate]);

  // Initial users load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Load messages for active user; backend also marks them as read
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeUser) return;
      try {
        const res = await axios.get(
          `http://localhost:4000/messages/${activeUser.id}`,
          { withCredentials: true }
        );
        setMessages(res.data.messages || []);

        // After marking as read on backend, refresh users so hasUnread updates
        await fetchUsers();
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
  }, [activeUser, fetchUsers]);

  // Send message (sender is enforced by backend using req.user.id)
  const handleSend = async (e) => {
    e.preventDefault();
    if (!activeUser || !body.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:4000/messages",
        { receiverId: activeUser.id, body },
        { withCredentials: true }
      );
      const newMsg = res.data.data;
      setMessages((prev) => [...prev, newMsg]);
      setBody("");

      // optional: refresh users (receiver will see unread dot when they fetch)
      await fetchUsers();
    } catch (err) {
      console.error("Failed to send message", err);
      alert(err.response?.data?.message || "Failed to send message");
    }
  };

  const displayName = (u) =>
    `${u.first_name ?? u.firstname ?? u.FirstName ?? ""} ${
      u.last_name ?? u.lastname ?? u.LastName ?? ""
    }`.trim();

  return (
    <div className="chat-page">
      <div className="chat-shell">
        {/* Left sidebar: user list */}
        <aside className="chat-sidebar">
          <header className="chat-sidebar__header">
            <div className="logo-wordmark">
              <span className="logo-wordmark__primary">Geno</span>
              <span className="logo-wordmark__accent">Connect</span>
            </div>
            <h2 className="chat-sidebar__title">Chats</h2>
          </header>

          {users.length === 0 && (
            <p className="chat-sidebar__empty">No other users yet.</p>
          )}

          <ul className="chat-sidebar__list">
            {users.map((u) => (
              <li
                key={u.id}
                onClick={() => setActiveUser(u)}
                className={
                  activeUser?.id === u.id
                    ? "chat-sidebar__item chat-sidebar__item--active"
                    : "chat-sidebar__item"
                }
              >
                <div className="chat-sidebar__avatar">
                  {(u.first_name ??
                    u.firstname ??
                    u.FirstName ??
                    u.email ??
                    "?")[0]
                    ?.toString()
                    .toUpperCase()}
                </div>
                <div className="chat-sidebar__info">
                  <div className="chat-sidebar__top-row">
                    <div className="chat-sidebar__name">{displayName(u)}</div>
                    {u.hasUnread && <span className="chat-sidebar__badge" />}
                  </div>
                  <div className="chat-sidebar__email">
                    {u.email ?? u.Email}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right pane: messages */}
        <main className="chat-main">
          {activeUser ? (
            <>
              <header className="chat-main__header">
                <div>
                  <h3 className="chat-main__title">
                    Chat with {displayName(activeUser)}
                  </h3>
                  <p className="chat-main__subtitle">
                    Messages between you and {displayName(activeUser)}.
                  </p>
                </div>
              </header>

              <div className="chat-main__messages">
                {messages.length === 0 && (
                  <p className="chat-main__empty">No messages yet. Say hi!</p>
                )}
                {messages.map((m) => {
                  const fromMe = m.sender_id === currentUserId;

                  return (
                    <div
                      key={m.id}
                      className={
                        fromMe
                          ? "chat-bubble chat-bubble--me"
                          : "chat-bubble chat-bubble--them"
                      }
                    >
                      <small className="chat-bubble__sender">
                        {fromMe
                          ? currentUserName
                          : displayName(activeUser) || "Unknown"}
                      </small>
                      <div className="chat-bubble__body">{m.body}</div>
                    </div>
                  );
                })}
              </div>

              <form className="chat-main__form" onSubmit={handleSend}>
                <input
                  type="text"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type a message…"
                  className="chat-main__input"
                />
                <button type="submit" className="chat-main__send">
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="chat-main__placeholder">
              <h3>Select a conversation</h3>
              <p>Choose a user on the left to start chatting.</p>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
      
      .chat-page {
        min-height: 100vh;
        display: flex;
        /* align-items: center;  remove this line */
        justify-content: center;
        padding: 24px;
        background: radial-gradient(circle at top, #1f2937 0, #020617 55%);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
          sans-serif;
        color: #e5e7eb;
    }

      .chat-shell {
          width: 100%;
          max-width: 1100px;
          min-height: 90vh; /* was height */
          background: #020617;
          border-radius: 18px;
          border: 1px solid rgba(148, 163, 184, 0.5);
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.8);
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr);
          overflow: hidden;
        }


        @media (max-width: 800px) {
          .chat-shell {
            grid-template-columns: minmax(0, 1fr);
          }
          .chat-sidebar {
            display: none;
          }
        }

        .chat-sidebar {
          border-right: 1px solid rgba(31, 41, 55, 0.9);
          padding: 16px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: radial-gradient(circle at top left, #020617, #020617);
        }

        .chat-sidebar__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .chat-sidebar__title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .chat-sidebar__empty {
          font-size: 13px;
          color: #9ca3af;
        }

        .chat-sidebar__list {
          list-style: none;
          padding: 0;
          margin: 0;
          overflow-y: auto;
        }

        .chat-sidebar__item {
          cursor: pointer;
          padding: 8px;
          border-radius: 10px;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s ease, transform 0.05s ease;
        }

        .chat-sidebar__item:hover {
          background: rgba(15, 23, 42, 0.95);
          transform: translateY(-1px);
        }

        .chat-sidebar__item--active {
          background: rgba(37, 99, 235, 0.18);
          border: 1px solid rgba(59, 130, 246, 0.6);
        }

        .chat-sidebar__avatar {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: radial-gradient(circle at 30% 0, #22c55e, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          color: #f9fafb;
        }

        .chat-sidebar__info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .chat-sidebar__top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-sidebar__name {
          font-size: 13px;
          font-weight: 500;
        }

        .chat-sidebar__email {
          font-size: 11px;
          color: #9ca3af;
        }

        .chat-sidebar__badge {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3);
        }

        .chat-main {
          padding: 16px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .chat-main__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .chat-main__title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .chat-main__subtitle {
          margin: 2px 0 0;
          font-size: 12px;
          color: #9ca3af;
        }

        .chat-main__messages {
          flex: 1;
          border: 1px solid rgba(31, 41, 55, 0.9);
          border-radius: 12px;
          padding: 8px;
          overflow-y: auto;
          background: radial-gradient(
            circle at top left,
            rgba(15, 23, 42, 0.85),
            #020617
          );
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .chat-main__empty {
          font-size: 13px;
          color: #9ca3af;
        }

        .chat-main__form {
          display: flex;
          gap: 8px;
          margin-top: 6px;
        }

        .chat-main__input {
          flex: 1;
          padding: 8px 10px;
          border-radius: 999px;
          border: 1px solid rgba(51, 65, 85, 0.95);
          background: rgba(15, 23, 42, 0.9);
          color: #e5e7eb;
          font-size: 13px;
          outline: none;
          transition: border-color 0.16s ease, box-shadow 0.16s ease,
            background 0.16s ease;
        }

        .chat-main__input::placeholder {
          color: rgba(148, 163, 184, 0.7);
        }

        .chat-main__input:focus {
          border-color: rgba(129, 140, 248, 0.95);
          box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.7);
          background: #020617;
        }

        .chat-main__send {
          border: none;
          border-radius: 999px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: #f9fafb;
          box-shadow: 0 10px 20px rgba(79, 70, 229, 0.7);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .chat-main__send:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 30px rgba(79, 70, 229, 0.9);
        }

        .chat-main__placeholder {
          margin: auto;
          text-align: center;
          color: #9ca3af;
        }

        .chat-main__placeholder h3 {
          margin: 0 0 4px;
        }

        .chat-bubble {
          max-width: 75%;
          padding: 6px 9px;
          border-radius: 14px;
          font-size: 13px;
          display: block;
        }

        .chat-bubble--me {
          margin-left: auto;
          background: #22c55e1a;
          border: 1px solid rgba(34, 197, 94, 0.7);
        }

        .chat-bubble--them {
          margin-right: auto;
          background: #111827;
          border: 1px solid rgba(31, 41, 55, 0.9);
        }

        .chat-bubble__sender {
          display: block;
          font-size: 10px;
          color: #9ca3af;
          margin-bottom: 2px;
        }

        .chat-bubble__body {
          word-break: break-word;
        }

        .logo-wordmark {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.6);
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.8);
        }

        .logo-wordmark__primary {
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #e5e7eb;
        }

        .logo-wordmark__accent {
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #22c55e, #4ade80);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </div>
  );
}

export default ChatPage;
