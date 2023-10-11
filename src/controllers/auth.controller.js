const Auth = require("../models/auth.model");
const { generateTokens, refresh: refreshTokens } = require("../utils/token");

exports.signin = async (req, res) => {
  const { login, password } = req.body;

  const auth_user = await Auth.authenticateUser({ login, password });

  if (auth_user) {
    const tokens = generateTokens({
      id: auth_user.id,
    });

    res.cookie("refreshToken", tokens.refresh, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).send({
      status: true,
      access: tokens.access,
      data: {
        id: auth_user.id,
        login: auth_user.login,
        type: auth_user.type,
      },
    });
    return;
  }
  res.status(401).send({
    status: "error",
    message: "Incorrect password",
  });
};

exports.logout = async (req, res, next) => {
  res.clearCookie("refreshToken");
  return res.json(token);
};

exports.refresh = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  try {
    const userData = await refreshTokens(refreshToken);
    res.cookie("refreshToken", userData.refresh, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).send({
      status: true,
      acsses: userData.access,
      data: {
        id: userData.user.id,
        login: userData.user.login,
      },
    });
  } catch {
    res.status(509).send({
      status: "error",
      message: "refresh token failed",
    });
  }
};
