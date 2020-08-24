const express = require("express");
const { check } = require("express-validator");

const signaturePlansController = require("../controllers/signaturePlans");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// create ne signature plan
// protected
router.post(
  "/novo",
  [
    check("clientId").not().isEmpty(),
    check("planType").not().isEmpty(),
    check("price").isDecimal(),
  ],
  checkAuth,
  signaturePlansController.createNew
);

module.exports = router;
