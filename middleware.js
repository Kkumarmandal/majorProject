const Listing = require ("./models/listing.js");
const Review = require ("./models/review.js");
const ExpressError = require ("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require ("./schema.js");


module.exports.isLoggedIn = (req,res,next) => {
    //console.log (req);  //req obj me info store rehta hai
    //console.log (req.user); 
    //console.log (req.path, "...", req.originalUrl);   
    if (!req.isAuthenticated ()){
        req.session.redirectUrl = req.originalUrl; //redirectUrl save 
        req.flash ("error", "You must be logged in to Create Listing!");
        return res.redirect ("/login"); //If Auhenticate hoga toh redirect to login page
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById (id);
    if ( !listing.owner.equals(res.locals.currUser._id)){
        req.flash ("error", "You are not the owner of this listing");
        return res.redirect (`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next) => { // joi schema validation
    let {error} = listingSchema.validate (req.body);   
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else {
        next();
    }
};

module.exports.validateReview = (req,res,next) => {  // joi schema validation 
    let {error} = reviewSchema.validate (req.body);   
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else {
        next();
    }
};

module.exports.isReviewAuthor = async (req,res,next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById (reviewId);
    if ( !review.author.equals(res.locals.currUser._id)){
        req.flash ("error", "You are not the author of this review");
        return res.redirect (`/listings/${id}`);
    }
    next();
};

