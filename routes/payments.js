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

// check for unpaying customers
// protected
router.post("/unpaying", checkAuth, paymentsController.unpaying);

module.exports = router;
