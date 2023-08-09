const router = require('express').Router();
const productController = require('../controllers/product.controller');
const validatePermissionAndToken = require('../validators/validatePermissionAndToken');
const { asyncHandler } = require('../middlewares/asyncHandler');

const access = 'work_with_menu';
router
    .route('/product')
    .get(asyncHandler(productController.getProducts))
    .post(asyncHandler(validatePermissionAndToken(access)), asyncHandler(productController.createProduct));

router
    .route('/product/:id')
    .put(asyncHandler(validatePermissionAndToken(access)), asyncHandler(productController.updateProduct))
    .delete(asyncHandler(validatePermissionAndToken(access)), asyncHandler(productController.deleteProduct));

router
    .route('/product/rel/:id')
    .put(asyncHandler(validatePermissionAndToken(access)), asyncHandler(productController.delRelProduct));

module.exports = router;
