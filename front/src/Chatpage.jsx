import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChatPage() {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = Number(currentUser.id);
  const currentUserName = currentUser.FirstName || currentUser.first_name || "";


  useEffect(() => {
    const authed = localStorage.getItem("isAuthenticated") === "true";
    if (!authed) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/users", {
          withCredentials: true,
        });
       
        const list = res.data.users || res.data; 
        setUsers(list.filter((u) => u.id !== currentUserId));
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeUser) return;
      try {
        const res = await axios.get(
          `http://localhost:4000/messages/${activeUser.id}`,
          { withCredentials: true }
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
  }, [activeUser]);

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
    } catch (err) {
      console.error("Failed to send message", err);
      alert(err.response?.data?.message || "Failed to send message");
    }
  };

  return (
  <div style={{ display: "flex", height: "90vh" }}>
    <div
      style={{
        width: "25%",
        borderRight: "1px solid #ccc",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <h3>Chats</h3>
      {users.length === 0 && <p>No other users yet.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map((u) => (
          <li
            key={u.id}
            onClick={() => setActiveUser(u)}
            style={{
              cursor: "pointer",
              padding: "0.5rem",
              borderRadius: "4px",
              marginBottom: "0.25rem",
              backgroundColor:
                activeUser?.id === u.id ? "#e0f0ff" : "transparent",
            }}
          >
            {u.first_name ?? u.firstname ?? u.FirstName}{" "}
            {u.last_name ?? u.lastname ?? u.LastName} <br />
            <small>{u.email ?? u.Email}</small>
          </li>
        ))}
      </ul>
    </div>

    <div style={{ flex: 1, padding: "1rem", boxSizing: "border-box" }}>
      {activeUser ? (
        <>
          <h3>
            Chat with{" "}
            {activeUser.first_name ??
              activeUser.firstname ??
              activeUser.FirstName}{" "}
            {activeUser.last_name ??
              activeUser.lastname ??
              activeUser.LastName}
          </h3>

          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "0.5rem",
              height: "70vh",
              overflowY: "auto",
              marginBottom: "0.5rem",
            }}
          >
            {messages.length === 0 && <p>No messages yet. Say hi!</p>}
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  justifyContent:
                    m.sender_id === currentUserId ? "flex-end" : "flex-start",
                  marginBottom: "0.25rem",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "0.4rem 0.6rem",
                    borderRadius: "12px",
                    backgroundColor:
                      m.sender_id === currentUserId ? "#d1ffd1" : "#f1f1f1",
                  }}
                >
                  <small
                    style={{
                      display: "block",
                      fontSize: "0.7rem",
                      color: "#555",
                    }}
                  >
                    {m.sender_id === currentUserId
                      ? currentUserName
                      : (activeUser.first_name ??
                         activeUser.firstname ??
                         activeUser.FirstName ??
                         "")}
                  </small>
                  <span>{m.body}</span>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSend}
            style={{ display: "flex", gap: "0.5rem" }}
          >
            <input
              type="text"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1, padding: "0.5rem" }}
            />
            <button type="submit">Send</button>
          </form>
        </>
      ) : (
        <p>Select a user on the left to start chatting.</p>
      )}
    </div>
  </div>
);
}





export default ChatPage;
