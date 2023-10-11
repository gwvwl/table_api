const { UserDB } = require("../database/modelDB");
const { logger } = require("../utils/logger");
const { hash: hashPassword } = require("../utils/password");

class UserModel {
  static async getUserById(id) {
    try {
      const user = await UserDB.findByPk(id);
      return user;
    } catch (error) {
      logger.error("Error getting user by ID:", error);
      throw error;
    }
  }

  static async getUserByLogin(login) {
    try {
      const user = await UserDB.findOne({
        where: { login },
      });
      return user;
    } catch (error) {
      logger.error("Error getting user by login:", error);
    }
  }

  static async createUser({ login, password, type }) {
    try {
      const user = await UserDB.create({
        login,
        type,
        password: hashPassword(password),
      });

      return user;
    } catch (error) {
      logger.error("Error creating user:", error);
      throw error;
    }
  }
}

module.exports = UserModel;
