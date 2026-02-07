const pool = require("./database");

async function createMessage(senderId, receiverId, body) {
  const result = await pool.query(
    `INSERT INTO messages (sender_id, receiver_id, body)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [senderId, receiverId, body]
  );
  return result.rows[0];
}

async function getConversation(userId1, userId2) {
  const result = await pool.query(
    `SELECT *
     FROM messages
     WHERE (sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1)
     ORDER BY created_at ASC`,
    [userId1, userId2]
  );
  return result.rows;
}

module.exports = {
  createMessage,
  getConversation,
};
