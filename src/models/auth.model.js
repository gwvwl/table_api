const { compare: comparePassword } = require("../utils/password");
const { logger } = require("../utils/logger");
const UserModel = require("./user.model");

class AuthService {
  static async authenticateUser({ login, password }) {
    try {
      const user = await UserModel.getUserByLogin(login);

      if (!user) {
        throw new Error("User not found");
      }
      const isPasswordValid = comparePassword(password, user.password);

      if (!isPasswordValid) {
        return false;
      }

      const data = UserModel.getUserById(user.id);
      return data;
    } catch (error) {
      logger.error("Error authenticating user:", error);
      throw error;
    }
  }
}
module.exports = AuthService;
