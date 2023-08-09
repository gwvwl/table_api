const router = require('express').Router();
const orderController = require('../controllers/order.controller');
const validatePermissionAndToken = require('../validators/validatePermissionAndToken');
const { asyncHandler } = require('../middlewares/asyncHandler');

const accessTypeAdmin = 'read_all_order';
const accessTypeWorker = 'read_order_not_done';

router.route('/order').post(asyncHandler(orderController.createOrder));

// for worker
router
    .route('/worker/order')
    .get(asyncHandler(validatePermissionAndToken(accessTypeWorker)), asyncHandler(orderController.getOrdersForWorker));
router
    .route('/worker/order/status/:order_id')
    .put(asyncHandler(validatePermissionAndToken(accessTypeWorker)), asyncHandler(orderController.updateStatus));
router
    .route('/worker/order/payment/:order_id')
    .put(asyncHandler(validatePermissionAndToken(accessTypeWorker)), asyncHandler(orderController.updatePayment));
// for admin
router
    .route('/order/admin')
    .get(asyncHandler(validatePermissionAndToken(accessTypeAdmin)), asyncHandler(orderController.getOrders));

router
    .route('/order/admin/:order_id')
    .put(asyncHandler(validatePermissionAndToken(accessTypeAdmin)), asyncHandler(orderController.updateOrdeAllInput));
router
    .route('/order/admin/addition/:order_id')
    .delete(
        asyncHandler(validatePermissionAndToken(accessTypeAdmin)),
        asyncHandler(orderController.deleteAdditionFromProductOrder),
    );
router
    .route('/order/admin/product/:order_id')
    .delete(
        asyncHandler(validatePermissionAndToken(accessTypeAdmin)),
        asyncHandler(orderController.deleteProductFromOrder),
    );
module.exports = router;
