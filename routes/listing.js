const express = require ("express");
const router = express.Router();
const wrapAsysnc = require ("../utils/wrapAsync.js");
//const ExpressError = require ("../utils/ExpressError.js");
//const {listingSchema, reviewSchema} = require ("../schema.js");
const Listing = require ("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require ("../middleware.js");
//controller ko require
const listingController = require ("../controllers/listings.js");
//multter ko require
const multer  = require('multer')
const {storage} = require ("../cloudConfig.js"); 
const upload = multer({ storage });


//router.route
router
    .route ("/")
    .get (wrapAsysnc (listingController.index)) 
    .post (
        isLoggedIn,
        upload.single ("listing[image]"),
        validateListing,        
        wrapAsysnc ( listingController.createListing)      
    );

//NEW ROUTE --- new route upar rakte hai because nahi rakha toh next ko id tarah interprut kar lega
router.get ("/new",isLoggedIn, listingController.renderNewForm);

router
    .route ("/:id")
    .get ( wrapAsysnc ( listingController.showListing))
    .put ( 
        isLoggedIn, 
        isOwner,
        upload.single ("listing[image]"), 
        validateListing, 
        wrapAsysnc (listingController.updateListing)
    )
    .delete ( isLoggedIn, isOwner, wrapAsysnc ( listingController.destroyListing ));


//EDIT ROUTE
router.get (
    "/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsysnc ( listingController.renderEditForm)
);

// //Index Route
// router.get ("/", wrapAsysnc (listingController.index));



// //Show Specific Route
// router.get (
//     "/:id", 
//     wrapAsysnc ( listingController.showListing)
// ); 

// //CREATE ROUTE
// router.post (
//     "/",
//     isLoggedIn,
//     validateListing,
//     wrapAsysnc ( listingController.createListing)      
// );



// //UPDATE ROUTE
// router.put (
//     "/:id",
//     isLoggedIn,   
//     isOwner, 
//     validateListing, 
//     wrapAsysnc (listingController.updateListing)
// );

// //DELETE ROUTE
// router.delete (
//     "/:id", 
//     isLoggedIn,
//     isOwner,
//     wrapAsysnc ( listingController.destroyListing )
// );

module.exports = router;