const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("./userModel.js");

const JWT_SECRET = process.env.JWT_SECRET;

async function registerUser(req, res, next) {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(firstname && lastname && email && password)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await userModel.createUser(
      firstname,
      lastname,
      email,
      hashedPassword
    );

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    await userModel.updateUserToken(user.id, token);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        FirstName: user.first_name,
        LastName: user.last_name,
        Email: user.email,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await bcryptjs.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    await userModel.updateUserToken(user.id, token);

    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };

    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          FirstName: user.first_name,
          LastName: user.last_name,
          Email: user.email,
        }
      });
  } catch (err) {
    next(err);
  }
}
async function listUsers(req, res, next) {
  try {
    const users = await userModel.getAllUsers();
    const filteredUsers = users.map(user => ({
      id: user.id,
      FirstName: user.first_name,
      LastName: user.last_name,
      Email: user.email,
    }));
    return res.status(200).json({
      success: true,
      count: filteredUsers.length,
      users : filteredUsers,
    });
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const user = await userModel.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { firstname, lastname, email } = req.body;

    if (!(firstname || lastname || email)) {
      return res.status(400).json({ message: "No fields to update" });
    }

    await userModel.updateUserProfile(
      req.user.id,
      firstname || null,
      lastname || null,
      email || null
    );

    const updated = await userModel.findUserById(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updated.id,
        FirstName: updated.first_name,
        LastName: updated.last_name,
        Email: updated.email,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function deleteUserById(id) {
  await userModel.deleteUserById(id);
}

module.exports = {
  registerUser,
  loginUser,
  listUsers,
  getProfile,
  updateProfile,
  deleteUserById,
};
