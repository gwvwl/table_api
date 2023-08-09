const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const checkLogin = require('../middlewares/checkLogin');
// const {
//   signup: signupValidator,
//   signin: signinValidator,
// } = require("../validators/auth");
const authController = require('../controllers/auth.controller');

router.route('/signin').post(asyncHandler(authController.signin));

router.route('/logout').post(asyncHandler(authController.logout));

router.route('/refresh').get(asyncHandler(authController.refresh));

module.exports = router;
