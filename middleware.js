const Listing = require("./models/listings");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {schema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in to do that!');
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectedUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirect = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validation = (req, res, next) => {
    let result = schema.validate(req.body);
    if(result.error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
}

module.exports.reviewValidation = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    if(result.error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
}

module.exports.isReviewOwner = async (req, res, next) => {
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You are not the owner of this review');
        return res.redirect(`/listings/${id}`)
    }
    next();
}