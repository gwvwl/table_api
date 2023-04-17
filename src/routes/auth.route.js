const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");
const checkLogin = require("../middlewares/checkLogin");
const {
  signup: signupValidator,
  signin: signinValidator,
} = require("../validators/auth");
const authController = require("../controllers/auth.controller");

router
  .route("/signup")
  .post(
    signupValidator,
    asyncHandler(checkLogin),
    asyncHandler(authController.signup)
  );

router
  .route("/signin")
  .post(signinValidator, asyncHandler(authController.signin));

module.exports = router;
