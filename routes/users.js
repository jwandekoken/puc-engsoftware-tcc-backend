const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// login user
// not protected
router.post("/login", usersController.login);

// create new user
// protected
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
  checkAuth,
  usersController.signup
);

// create new instructor
// protected
router.post(
  "/instrutor/novo",
  [
    check("name").not().isEmpty(),
    check("cpf").not().isEmpty(),
    check("rg").not().isEmpty(),
    check("userType").not().isEmpty(),
    check("typeOfActivity").not().isEmpty(),
  ],
  checkAuth,
  usersController.createNewInstructor
);

// get all users
// protected
router.get("/", checkAuth, usersController.getUsers);

// get user by name
// protected
router.get("/:name", checkAuth, usersController.getClientByName);

// get user by name
// protected
router.get("/instrutor/:name", checkAuth, usersController.getInstructorByName);

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
