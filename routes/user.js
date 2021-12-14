const express = require("express");
const router = express.Router();
const passport = require("passport");

// Include Controller
const userController = require("../controllers/user");
// Include server-side validation
const validation = require("../express-validator");

router.get("/login", userController.getLogin);

router.post(
  "/login",
  //userController.postLogin
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login"
  })
);

router.get("/register", userController.getRegister);

router.post("/register", validation.registerUser, userController.postRegister);

router.get("/logout", userController.getLogout);

module.exports = router;
