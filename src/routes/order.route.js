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
  );
module.exports = router;
