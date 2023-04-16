const db = require("../config/db.config");
const {
  createNewUser: createNewUserQuery,
  findUserByEmail: findUserByEmailQuery,
  countBase,
} = require("../database/queries");
const { logger } = require("../utils/logger");

class User {
  constructor(name, email, phone, position, photo) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.position = position;
    this.photo = photo;
  }

  static create(newUser, cb) {
    db.query(
      createNewUserQuery,
      [
        newUser.name,
        newUser.phone,
        newUser.email,
        newUser.position,
        newUser.photo,
      ],
      (err, res) => {
        if (err) {
          logger.error(err.message);
          cb(err, null);
          return;
        }
        cb(null, {
          id: res.insertId,
          name: newUser.name,
          phone: newUser.phone,
          email: newUser.email,
          position: newUser.position,
          photo: newUser.photo,
        });
      }
    );
  }

  static findByEmail(email, cb) {
    db.query(findUserByEmailQuery, email, (err, res) => {
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
