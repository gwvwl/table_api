const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = require("../utils/secrets");
const { logger } = require("./logger");
const { TokenDB } = require("../database/modelDB");
const UserModel = require("../models/user.model");

const generateTokens = ({ id, permissions = "", type }) => {
  const access = jwt.sign({ id, permissions, type }, JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });
  const refresh = jwt.sign({ id }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { access, refresh };
};
const decodeAccsess = (token) => {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (error) {
    logger.error(error);
    return false;
  }
};

const decodeRefresh = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    logger.error(error);
    return false;
  }
};

const saveToken = async (userId, refreshToken) => {
  try {
    const token = await TokenDB.findOne({ where: { user_id: userId } });
    if (token) {
      token.refreshToken = refreshToken;
      return token.save();
    }
    const newToken = await TokenDB.create({ user_id: userId, refreshToken });
    return newToken;
  } catch (error) {
    console.error("Error saving token:", error);
    throw error;
  }
};

const removeToken = async (refreshToken) => {
  try {
    const deletedToken = await TokenDB.destroy({ where: { refreshToken } });
    return deletedToken;
  } catch (error) {
    console.error("Error removing token:", error);
    throw error;
  }
};

const findToken = async (refreshToken) => {
  try {
    const token = await TokenDB.findOne({ where: { refreshToken } });
    return token;
  } catch (error) {
    console.error("Error finding token:", error);
    throw error;
  }
};
const refresh = async (refreshToken) => {
  const userData = decodeRefresh(refreshToken);

  // const tokenFromDb = await findToken(refreshToken);
  if (!userData) {
    throw logger.error("userData and tokenFromDb not exist");
  }
  const user = await UserModel.getUserById(userData.id);

  const tokens = generateTokens({
    id: user.id,
  });

  return { ...tokens, user: user.toJSON() };
};

module.exports = {
  generateTokens,
  decodeAccsess,
  decodeRefresh,
  removeToken,
  findToken,
  saveToken,
  refresh,
};
