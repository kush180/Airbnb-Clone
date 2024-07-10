const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");
const {schema, reviewSchema} = require("../schema.js");
const Joi = require('joi');
const flash = require('connect-flash');
const {isLoggedIn, isOwner, validation} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {cloudinary, storage} = require("../cloudConfig.js");
const upload = multer({ storage });
//listings
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn ,upload.single('image'), wrapAsync(listingController.createListing));

//create route
router.get("/new",isLoggedIn, listingController.newListing);

//show route
router.route("/:id")
    .get(wrapAsync(listingController.readListing))
    .put(isOwner ,upload.single('image'),validation ,wrapAsync(listingController.putEditedListing))
    .delete(isOwner, wrapAsync(listingController.destroyListing));

router.get("/:id/edit", isOwner ,isLoggedIn,wrapAsync(listingController.editListing));


module.exports = router;