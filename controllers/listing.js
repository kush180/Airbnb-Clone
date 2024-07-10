const Listing = require("../models/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

module.exports.index = async (req, res, next) => {
    let listingData = await Listing.find();
    if(!listingData) {
        req.flash("error", "The listing you are looking for does not exist.")
        res.redirect("/listings");
    }
    res.render("listings/home.ejs", {data: listingData});
}

module.exports.newListing = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.readListing = async (req, res, next) => {
    let {id} = req.params;
    let listp = await Listing.findById(id).populate({path: "reviews", populate: { path:"author"}}).populate("owner");
    res.render("listings/read.ejs", {listp});
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let {title, description, image, price, location, country} = req.body;
    let newList = new Listing({title, description, image, price, location, country});
    newList.owner = req.user._id;
    newList.image = {url, filename};
    const response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1,
    }).send();
    newList.geometry = response.body.features[0].geometry;
    // console.log(newList.geometry.coordinates);
    await newList.save();
    req.flash("success", "New Listing Registered!");
    res.redirect("/listings");
}

module.exports.editListing = async (req, res, next) => {
    let {id} = req.params;
    let list = await Listing.findById(id);
    let originalImageUrl = list.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300/w_250");
    res.render("listings/edit.ejs", {list, originalImageUrl});
}

module.exports.putEditedListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, image, price, location, country } = req.body;

        let list = await Listing.findByIdAndUpdate(id, {
            title, description, image, price, location, country
        }, { new: true });

        const response = await geocodingClient.forwardGeocode({
            query: location,
            limit: 1,
        }).send();

        if (response.body.features.length > 0) {
            list.geometry = response.body.features[0].geometry;
        }

        if (req.file) {
            const { path: url, filename } = req.file;
            list.image = { url, filename };
        }

        await list.save();

        req.flash("success", "Listing Updated.");

        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error updating listing:", error);
        req.flash("error", "Failed to update listing.");
        res.redirect(`/listings/${id}/edit`);
    }
};


module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let result = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted.");
    console.log(result);
    res.redirect("/listings");
}