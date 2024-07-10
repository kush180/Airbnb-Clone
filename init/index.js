const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

main().then(() => {
    console.log("Connection Established");
}).catch((err) => {
    console.log(err);
});

async function init() {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6687c17301372445790d0077"
    }));    
    Listing.insertMany(initData.data).then(() => {
        console.log("Data Inserted");
    }).catch((Err) => {
        console.log(Err);
    });
}

init();