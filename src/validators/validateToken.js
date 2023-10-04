const { decodeAccsess } = require("../utils/token");

const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = (authHeader && authHeader.split(" ")[1]) || authHeader;

  const verifyToken = decodeAccsess(token);
  if (!verifyToken) {
    res.status(401).send({
      status: "error",
      message: "Token is invalid",
    });
    return;
  }

  next();
};

module.exports = validateToken;
