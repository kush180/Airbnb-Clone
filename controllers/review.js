const Listing = require("../models/listings.js");
const Review = require("../models/review.js");


module.exports.newReview = async (req, res) => {
    let {id} = req.params;
    let {rating: newRating, comment: newCmnt} = req.body;
    let list = await Listing.findById(id);
    let review = new Review({
        rating: newRating, 
        comment: newCmnt
    });
    review.author = req.user._id;
    review = await review.populate("author");
    list.reviews.push(review);
    await review.save();
    await list.save();
    console.log(list);
    req.flash("success", "Review Created.");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
}