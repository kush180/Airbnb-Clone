const User = require("../models/user.js");

module.exports.renderSignup = (req, res) => {
    res.render("user/signup.ejs");
}

module.exports.signUp = async(req, res) => {
    try {
        const {username, email, password} = req.body;
        const newUser = new User({
            username: username,
            email: email
        });
        let regUser = await User.register(newUser, password);
        req.login(regUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("user/login.ejs");
}

module.exports.login = (req, res) => {
    let Url = res.locals.redirect || "/listings";
    req.flash("success", "Welcome back!");
    res.redirect(Url);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
}