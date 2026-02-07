const {
  createMessage,
  getConversation: getConversationFromModel,
} = require("./messageModel");

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
