const pool = require("./database.js");

async function findUserByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
}

async function findUserById(id) {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

async function createUser(firstname, lastname, email, hashedPassword) {
  const result = await pool.query(
    "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
    [firstname, lastname, email, hashedPassword]
  );
  return result.rows[0];
}

async function updateUserToken(id, token) {
  await pool.query(
    "UPDATE users SET token = $1 WHERE id = $2",
    [token, id]
  );
}

async function getAllUsers() {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
}

async function deleteUserById(id) {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
}

async function updateUserProfile(id, firstname, lastname, email) {
  await pool.query(
    "UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4",
    [firstname, lastname, email, id]
  );
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserToken,
  getAllUsers,
  deleteUserById,
  updateUserProfile,
};
