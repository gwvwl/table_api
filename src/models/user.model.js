const db = require("../config/db.config");
const {
  createNewUser: createNewUserQuery,
  findUserByLogin: findUserByLoginQuery,
  countBase,
} = require("../database/queries");
const { logger } = require("../utils/logger");

class User {
  constructor(login, password) {
    this.login = login;
    this.password = password;
  }

  static create(newUser, cb) {
    db.query(
      createNewUserQuery,
      [newUser.login, newUser.password],
      (err, res) => {
        if (err) {
          logger.error(err.message);
          cb(err, null);
          return;
        }
        cb(null, {
          id: res.insertId,
          login: newUser.login,
          password: newUser.password,
        });
      }
    );
  }

  static findByLogin(login, cb) {
    db.query(findUserByLoginQuery, login, (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      if (res.length) {
        cb(null, res[0]);
        return;
      }
      cb({ kind: "not_found" }, null);
    });
  }

  static async findCountBase(cb) {
    db.query(countBase, (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      if (res.length) {
        cb(null, res[0]);
        return;
      }
      cb({ kind: "not_found" }, null);
    });
  }

  static findUsers(offset, cb) {
    db.query(
      `SELECT * FROM users ORDER BY created_on DESC LIMIT 6 OFFSET ${offset}`,
      (err, res) => {
        if (err) {
          logger.error(err.message);
          cb(err, null);
          return;
        }
        if (res.length) {
          cb(null, res);
          return;
        }
        cb({ kind: "not_found" }, null);
      }
    );
  }
}

module.exports = User;
