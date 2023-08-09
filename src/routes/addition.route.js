const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const AdditionController = require('../controllers/addition.controller');
const validatePermissionAndToken = require('../validators/validatePermissionAndToken');

const access = 'work_with_menu';
router
    .route('/additions')
    .get(asyncHandler(AdditionController.getAddition))
    .post(asyncHandler(validatePermissionAndToken(access)), asyncHandler(AdditionController.createAddition));

router
    .route('/additions/:id')
    .put(asyncHandler(validatePermissionAndToken(access)), asyncHandler(AdditionController.updateAddition))
    .delete(asyncHandler(validatePermissionAndToken(access)), asyncHandler(AdditionController.deleteAddition));

router
    .route('/additions/stock/:id')
    .put(asyncHandler(validatePermissionAndToken(access)), asyncHandler(AdditionController.delStockFromAddition));

module.exports = router;
