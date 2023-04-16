const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");

const testController = require("../controllers/token.controller");

router.route("/token").get(asyncHandler(testController.token));

module.exports = router;
