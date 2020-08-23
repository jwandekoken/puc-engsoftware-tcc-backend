const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// login user
// not protected
router.post("/login", usersController.login);

// create new user
// not protected
router.post(
  "/novo",
  [
    check("name").not().isEmpty(),
    check("password").isLength({ min: 6 }),
    check("email").normalizeEmail().isEmail(),
    check("cpf").not().isEmpty(),
    check("rg").not().isEmpty(),
    check("userType").not().isEmpty(),
    check("address").not().isEmpty(),
  ],
  usersController.signup
);

// get all users
// protected
router.get("/", checkAuth, usersController.getUsers);

// updated instructor user
// protected
router.patch(
  "/instrutor/:instructorId",
  checkAuth,
  usersController.updateInstructor
);

// delete instructor user
// protected
router.delete(
  "/instrutor/:instructorId",
  checkAuth,
  usersController.deleteInstructor
);

module.exports = router;
