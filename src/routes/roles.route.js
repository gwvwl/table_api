const router = require('express').Router();
const roleController = require('../controllers/roles.controller');
const { asyncHandler } = require('../middlewares/asyncHandler');
const validatePermissionAndToken = require('../validators/validatePermissionAndToken');

const access = 'work_with_role';
router
    .route('/roles')
    .get(asyncHandler(roleController.getRole))
    .post(asyncHandler(validatePermissionAndToken(access)), asyncHandler(roleController.createRole));

router
    .route('/roles/:id')
    .put(asyncHandler(validatePermissionAndToken(access)), asyncHandler(roleController.updateRole))
    .delete(asyncHandler(validatePermissionAndToken(access)), asyncHandler(roleController.deleteRole));

module.exports = router;
