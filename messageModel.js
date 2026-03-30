const pool = require("./database");

// create a new message (unread by default)
async function createMessage(senderId, receiverId, body) {
  const result = await pool.query(
    `INSERT INTO messages (sender_id, receiver_id, body, is_read)
     VALUES ($1, $2, $3, false)
     RETURNING *`,
    [senderId, receiverId, body]
  );
  return result.rows[0];
}

// get conversation between two users
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

// mark all messages from userId2 TO userId1 as read
async function markConversationAsRead(userId1, userId2) {
  await pool.query(
    `UPDATE messages
     SET is_read = true
     WHERE receiver_id = $1
       AND sender_id = $2
       AND is_read = false`,
    [userId1, userId2]
  );
}

// check if senderId has any unread messages to receiverId
async function hasUnreadFrom(senderId, receiverId) {
  const result = await pool.query(
    `SELECT EXISTS (
       SELECT 1
       FROM messages
       WHERE sender_id = $1
         AND receiver_id = $2
         AND is_read = false
     ) AS has_unread`,
    [senderId, receiverId]
  );
  return result.rows[0].has_unread;
}

module.exports = {
  createMessage,
  getConversation,
  markConversationAsRead,
  hasUnreadFrom,
};
