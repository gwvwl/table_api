const router = require('express').Router();
const validatePermissionAndToken = require('../validators/validatePermissionAndToken');
const { asyncHandler } = require('../middlewares/asyncHandler');

const permission = require('../controllers/permission.controller');

const access = 'work_with_permission';

router
    .route('/permission')
    .get(asyncHandler(validatePermissionAndToken(access)), asyncHandler(permission.getPermission))
    .delete(asyncHandler(validatePermissionAndToken(access)), asyncHandler(permission.removePermission))
    .post(asyncHandler(validatePermissionAndToken(access)), asyncHandler(permission.addPermission));

module.exports = router;
