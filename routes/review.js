const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");
const {schema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const {reviewValidation, isLoggedIn, isReviewOwner} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

router.post("/", isLoggedIn,reviewValidation, wrapAsync(reviewController.newReview));


//Delete route for reviews
router.delete("/:reviewId", isLoggedIn, isReviewOwner,wrapAsync(reviewController.destroyReview));

module.exports = router;