const {
  createMessage,
  getConversation: getConversationFromModel,
  markConversationAsRead,
} = require("./messageModel");
const { getIO, getOnlineUsers } = require("./socketServer");

// POST /messages
async function sendMessage(req, res, next) {
  try {
    const senderId = req.user.id;
    const { receiverId, body } = req.body;

    if (!senderId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!receiverId || !body || !body.trim()) {
      return res
        .status(400)
        .json({ message: "receiverId and body are required" });
    }

    const msg = await createMessage(senderId, receiverId, body.trim());

    const io = getIO();
    const onlineUsers = getOnlineUsers();

    if (io && onlineUsers) {
      const receiverSocketId = onlineUsers.get(String(receiverId));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("new_message", msg);
      }
      const senderSocketId = onlineUsers.get(String(senderId));
      if (senderSocketId) {
        io.to(senderSocketId).emit("new_message", msg);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: msg,
    });
  } catch (err) {
    next(err);
  }
}

// GET /messages/:userId
async function getConversationController(req, res, next) {
  try {
    const userId1 = req.user.id; // logged-in user
    const userId2 = Number(req.params.userId);

    if (!userId1) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!userId2) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const messages = await getConversationFromModel(userId1, userId2);

    // mark all messages from userId2 TO userId1 as read
    await markConversationAsRead(userId1, userId2);

    return res.status(200).json({ success: true, messages });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  sendMessage,
  getConversation: getConversationController,
};
