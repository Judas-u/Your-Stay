const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/users");

// Render signup form
router.get("/signup", userController.renderSignupForm);

// Handle signup logic
router.post(
	"/signup",
	wrapAsync(userController.signup)
);

// Render login form
router.get("/login", userController.renderLoginForm);

// Handle login logic
router.post(
	"/login",
	saveRedirectUrl,
	passport.authenticate("local", {
		failureRedirect: "/login",
		failureFlash: true,
	}),
	wrapAsync(userController.login)
);

// Handle logout
router.get("/logout", userController.logout);

module.exports = router;
