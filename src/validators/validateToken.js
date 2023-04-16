const { decode } = require("../utils/token");

const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = (authHeader && authHeader.split(" ")[1]) || authHeader;
  const verifyToken = decode(token);
  if (!verifyToken) {
    res.status(400).send({
      status: "error",
      message: "token is invalid",
    });
    return;
  }

  next();
};

module.exports = validateToken;
