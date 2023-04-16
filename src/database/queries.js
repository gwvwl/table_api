const { DB_NAME } = require("../utils/secrets");

const createDB = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;

const dropDB = `DROP DATABASE IF EXISTS ${DB_NAME}`;

const createTableUSers = `
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NULL,
    phone VARCHAR(50) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    position VARCHAR(50) NOT NULL,
    photo VARCHAR(255) NOT NULL,
    created_on TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
)
`;

const createNewUser = `
INSERT INTO users VALUES(null, ?, ?, ?, ?, ?, NOW())
`;

const findUserByEmail = `
SELECT * FROM users WHERE email = ?
`;
const countBase = `
SELECT count(*) as count FROM users 
`;

const findUsers = "SELECT * FROM users";

module.exports = {
  createDB,
  dropDB,
  createTableUSers,
  createNewUser,
  findUserByEmail,
  findUsers,
  countBase,
};
