const {
  createMessage,
  getConversation: getConversationFromModel,
} = require("./messageModel");
const { getIO, getOnlineUsers } = require("./socketServer");
async function sendMessage(req, res, next) {
  try {
    const senderId = req.user.id;
    const { receiverId, body } = req.body;

    if (!receiverId || !body) {
      return res
        .status(400)
        .json({ message: "receiverId and body are required" });
    }

    const msg = await createMessage(senderId, receiverId, body);

    const io = getIO();
    const onlineUsers = getOnlineUsers();

    if (io) {
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

async function getConversationController(req, res, next) {
  try {
    const userId1 = req.user.id;
    const userId2 = Number(req.params.userId);

    if (!userId2) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const messages = await getConversationFromModel(userId1, userId2);

    return res.status(200).json({ success: true, messages });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  sendMessage,
  getConversation: getConversationController,
};
