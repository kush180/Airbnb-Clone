const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectedUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

//signup
router.route("/signup")
    .get(userController.renderSignup)
    .post(userController.signUp);

//login
router.route("/login")
    .get(userController.renderLogin)
    .post(saveRedirectedUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.login);

//logout
router.get("/logout", userController.logout);

module.exports = router;