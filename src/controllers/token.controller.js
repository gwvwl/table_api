const { generate: generateToken } = require("../utils/token");

exports.token = (req, res) => {
  const token = generateToken("dsdss121");
  res.status(201).send({
    status: "success",
    token,
  });
};
