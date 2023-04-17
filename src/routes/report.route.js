const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");
const validateToken = require("../validators/validateToken");

const reportController = require("../controllers/report.controller");

router
  .route("/report")
  .post(
    asyncHandler(validateToken),
    asyncHandler(reportController.createReport)
  );

router
  .route("/report")
  .get(asyncHandler(validateToken), asyncHandler(reportController.getReport));

router
  .route("/report/:id")
  .put(asyncHandler(validateToken), asyncHandler(reportController.putReport));

router
  .route("/report/:id")
  .delete(
    asyncHandler(validateToken),
    asyncHandler(reportController.deleteReport)
  );

module.exports = router;
