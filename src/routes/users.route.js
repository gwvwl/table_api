const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");
const validateToken = require("../validators/validateToken");
const validateFile = require("../validators/validateFile");
const checkEmail = require("../middlewares/checkEmail");
const { signup: signupValidator } = require("../validators/users.js");
const usersController = require("../controllers/users.controller");

router
  .route("/signup")
  .post(
    asyncHandler(validateToken),
    signupValidator,
    asyncHandler(validateFile),
    asyncHandler(checkEmail),
    asyncHandler(usersController.signup)
  );

router.route("/users").get(asyncHandler(usersController.users));

module.exports = router;
