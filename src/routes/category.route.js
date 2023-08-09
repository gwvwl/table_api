const router = require('express').Router();
const categoryController = require('../controllers/category.controller');
const validatePermissionAndToken = require('../validators/validatePermissionAndToken');
const { asyncHandler } = require('../middlewares/asyncHandler');

const access = 'work_with_menu';
router
    .route('/category')
    .get(asyncHandler(categoryController.getCategories))
    .post(asyncHandler(validatePermissionAndToken(access)), asyncHandler(categoryController.createCategory));

router
    .route('/category/:id')
    .put(asyncHandler(validatePermissionAndToken(access)), asyncHandler(categoryController.updateCategory))
    .delete(asyncHandler(validatePermissionAndToken(access)), asyncHandler(categoryController.deleteCategory));

module.exports = router;
