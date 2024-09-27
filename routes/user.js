const express = require ("express");
const router = express.Router();
const User = require ("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require ("../middleware.js");

//require controller
const userController = require ("../controllers/users.js");

// Router route
router
    .route ("/signup")
    .get (userController.renderSignupForm)
    .post (wrapAsync ( userController.signup));

router
    .route ("/login")
    .get ( userController.renderLoginform)
    .post (
        saveRedirectUrl,
        passport.authenticate ("local", {
            failureRedirect: "/login", 
            failureFlash: true,
        }), 
        userController.login   
    );

//LOGOUT USER
router.get ("/logout", userController.logout);

module.exports = router;

// //SIGN-UP PAGE
// router.get ("/signup", userController.renderSignupForm);

// router.post ("/signup", wrapAsync ( userController.signup));

//LOGIN PAGE

// router.get ("/login", userController.renderLoginform);

// router.post (
//     "/login", 
//     saveRedirectUrl,
//     passport.authenticate ("local", {
//         failureRedirect: "/login", 
//         failureFlash: true,
//     }), userController.login   
// );





