const User = require("../models/user");

// Render signup form
module.exports.renderSignupForm = (req, res) => {
	res.render("users/signup");
};

// Render login form
module.exports.renderLoginForm = (req, res) => {
	res.render("users/login");
};

// Handle user signup
module.exports.signup = async (req, res, next) => {
	try {
		const { username, email, password } = req.body;
		const newUser = new User({ email, username });
		const registeredUser = await User.register(newUser, password);

		console.log(registeredUser);

		req.login(registeredUser, (err) => {
			if (err) return next(err);  
			req.flash("success", "Welcome to WanderLust!");
			res.redirect("/listings");
		});
	} catch (e) {
		req.flash("error", e.message);
		res.redirect("/signup");
	}
};


// Handle user login
module.exports.login = (req, res) => {
	req.flash("success", "Welcome back!");
	const redirectUrl = req.session.redirectUrl || "/listings";
	delete req.session.redirectUrl;
	res.redirect(redirectUrl);
};

// Handle user logout
module.exports.logout = (req, res, next) => {
	req.logout((err) => {
		if (err) return next(err);
		req.flash("success", "You are logged out!");
		res.redirect("/listings");
	});
};
