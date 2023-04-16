const Joi = require("joi");
const validatorHandler = require("../middlewares/validatorHandler");

const signup = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string()
      .trim()
      .email({ tlds: { allow: false } })
      .required(),
    phone: Joi.string()
      // .length(10)
      // .pattern(/^[0-9]+$/)
      .required(),
    position: Joi.string().required(),
    photo: Joi.object().unknown(true),
  });
  validatorHandler(req, res, next, schema);
};

module.exports = {
  signup,
};
