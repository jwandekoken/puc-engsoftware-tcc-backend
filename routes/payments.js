const express = require("express");
const { check } = require("express-validator");

const paymentsController = require("../controllers/payments");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// create new payment
// protected
router.post(
  "/novo",
  [
    check("signaturePlanId").not().isEmpty(),
    check("paymentDate").not().isEmpty(),
  ],
  checkAuth,
  paymentsController.createNew
);

module.exports = router;
