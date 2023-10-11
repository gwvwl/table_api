const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");
const OrderController = require("../controllers/order.controller");
const validateToken = require("../validators/validateToken");

router
  .route("/order")
  .post(asyncHandler(OrderController.createOrder))

  .get(asyncHandler(validateToken), asyncHandler(OrderController.getOrder));
router
  .route("/order/:id")
  .delete(
    asyncHandler(validateToken),
    asyncHandler(OrderController.deleteOrder)
  )
  .put(asyncHandler(validateToken), asyncHandler(OrderController.updateOrder));
router
  .route("/connect_order")
  .get(
    asyncHandler(validateToken),
    asyncHandler(OrderController.connectOrderWorker)
  );
module.exports = router;
