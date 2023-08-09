const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const validateToken = require('../validators/validateToken');
const validatePermissionAndToken = require('../validators/validatePermissionAndToken');
const userController = require('../controllers/user.controller');

router.route('/signup').post(asyncHandler(userController.signup));

// For clients
router
    .route('/user')
    .put(asyncHandler(validateToken), asyncHandler(userController.updateUser))
    .delete(asyncHandler(validateToken), asyncHandler(userController.deleteUser));

router.route('/user/order').get(asyncHandler(validateToken), asyncHandler(userController.getUserOrderHistory));

const adminAccess = 'create_worker';
// for admin

router
    .route('/user/admin/worker')
    .post(asyncHandler(validatePermissionAndToken(adminAccess)), asyncHandler(userController.createWorker))
    .get(asyncHandler(validatePermissionAndToken(adminAccess)), asyncHandler(userController.getUserTypeWorker));

router
    .route('/user/admin/client')
    .get(asyncHandler(validatePermissionAndToken(adminAccess)), asyncHandler(userController.getUserTypeClient));

router
    .route('/user/admin')
    .post(asyncHandler(validatePermissionAndToken(adminAccess)), asyncHandler(userController.createAdmin))
    .get(asyncHandler(validatePermissionAndToken(adminAccess)), asyncHandler(userController.getUserTypeAdmin));

router
    .route('/user/admin/:id')
    .delete(asyncHandler(validatePermissionAndToken(adminAccess)), asyncHandler(userController.deleteAnyUser))
    .put(asyncHandler(validatePermissionAndToken(adminAccess)), asyncHandler(userController.putUserForAdmin));

router
    .route('/user/admin/permission/:id')
    .delete(asyncHandler(validatePermissionAndToken(adminAccess)), asyncHandler(userController.addPermissionsç))
    .put(asyncHandler(validatePermissionAndToken(adminAccess)), asyncHandler(userController.removePermissionsFromUser));

module.exports = router;
