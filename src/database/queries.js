const { DB_NAME } = require("../utils/secrets");

const createDB = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;

const dropDB = `DROP DATABASE IF EXISTS ${DB_NAME}`;

// report
const createTableReport = `
CREATE TABLE IF NOT EXISTS report (
    id INT PRIMARY KEY AUTO_INCREMENT,
    driver_name VARCHAR(50) NOT NULL,
    trailer VARCHAR(50) NOT NULL,
    driver_passport VARCHAR(50) NOT NULL,
    driver_phone VARCHAR(50) NOT NULL,
    driver_license VARCHAR(50) NOT NULL,
    transport_id VARCHAR(50) NOT NULL,
    transport_name VARCHAR(50) NOT NULL,
    culture VARCHAR(50) NOT NULL,
    port VARCHAR(50) NOT NULL,
    transport_type VARCHAR(50) NOT NULL,
    created_on TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
)
`;

const createReport = `
INSERT INTO report VALUES(null, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
`;

const findReportByIdQuery = `
SELECT * FROM report WHERE id = ?
`;
// user
const createTableUser = `
CREATE TABLE IF NOT EXISTS user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(50) NOT NULL UNIQUE,
    admin VARCHAR(10),
    password VARCHAR(255) NOT NULL UNIQUE,
    created_on TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
)
`;

const createNewUser = `
INSERT INTO user VALUES(null, ?, true, ?, NOW())
`;

const findUserByLogin = `
SELECT * FROM user WHERE login = ?
`;

const findUsers = "SELECT * FROM users";

module.exports = {
  createDB,
  dropDB,
  createTableReport,
  createReport,
  createNewUser,
  findUserByLogin,
  findUsers,
  createTableUser,
  findReportByIdQuery,
};
