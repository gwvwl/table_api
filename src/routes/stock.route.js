const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const StockController = require('../controllers/stock.conntroller');
const validatePermissionAndToken = require('../validators/validatePermissionAndToken');

const access = 'work_with_menu';
router
    .route('/stock')
    .get(asyncHandler(StockController.getStock))
    .post(asyncHandler(validatePermissionAndToken(access)), asyncHandler(StockController.createStock));

router
    .route('/stock/:id')
    .put(asyncHandler(validatePermissionAndToken(access)), asyncHandler(StockController.updateStock))
    .delete(asyncHandler(validatePermissionAndToken(access)), asyncHandler(StockController.deleteStock));

module.exports = router;
