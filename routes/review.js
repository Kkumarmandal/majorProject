const express = require ("express");
const router = express.Router({mergeParams: true});
const wrapAsysnc = require ("../utils/wrapAsync.js");
//const ExpressError = require ("../utils/ExpressError.js");
//const {listingSchema, reviewSchema} = require ("../schema.js");
const Review = require ("../models/review.js");
const Listing = require ("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require ("../middleware.js");

const reviewController = require ("../controllers/reviews.js");

//Reviews

//POST REVIEW ROUTE
router.post ("/", 
    isLoggedIn,
    validateReview, 
    wrapAsysnc (reviewController.createReview)
);

//DELETE REVIEW ROUTE
router.delete (
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor, 
    wrapAsysnc (reviewController.destroyReview)
);

module.exports = router;