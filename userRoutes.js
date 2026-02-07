const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

const {
  registerUser,
  loginUser,
  listUsers,
  getProfile,
  updateProfile,
} = require("./userController");

const {
  sendMessage,
  getConversation,
} = require("./messageController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", (req, res) => {
  res
    .clearCookie("token", { httpOnly: true })
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

router.get("/users", auth, listUsers);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.post("/messages", auth, sendMessage);
router.get("/messages/:userId", auth, getConversation);

module.exports = {
  router,
  auth,
};
