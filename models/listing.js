const mongoose = require ("mongoose");
//const review = require("./review");
const { types } = require("joi");
const Schema = mongoose.Schema;
const Review = require ("./review.js");

//SCHEMA WRITING
const listingSchema = new Schema ({
    title: {
        type: String,
        require: true,
    },
    description: String,
    image: { //default image ko copy image address karne ka
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});

listingSchema.post ("findOneAndDelete", async (listing) => {
    if (listing){
        await Review.deleteMany ({ _id: { $in: listing.reviews}});
    }
});

const Listing = mongoose.model ("Listing", listingSchema);

module.exports = Listing;