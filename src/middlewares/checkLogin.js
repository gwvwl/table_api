const User = require("../models/user.model");

const checkLogin = (req, res, next) => {
  const { login } = req.body;

  User.findByLogin(login, (_, data) => {
    if (data) {
      res.status(400).send({
        status: "error",
        message: `A user with email address '${login}' already exits`,
      });
      return;
    }
    next();
  });
};

module.exports = checkLogin;
