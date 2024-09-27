if (process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require ("express");
const app = express();
const mongoose = require ("mongoose");
//const Listing = require ("./models/listing.js");
const path = require ("path");
const methodOverride = require ("method-override");
const ejsMate = require ("ejs-mate");
//const wrapAsysnc = require ("./utils/wrapAsync.js");
const ExpressError = require ("./utils/ExpressError.js");
//const {listingSchema, reviewSchema} = require ("./schema.js");
//const Rewiew = require ("./models/review.js");
const session = require ("express-session");
const MongoStore = require("connect-mongo");
const flash = require ("connect-flash");
const passport = require ("passport");
const LocalStrategy = require ("passport-local");
const User = require ("./models/user.js");  //user model ko require


const listingsRouter = require ("./routes/listing.js");
const reviewsRouter = require ("./routes/review.js");
const userRouter = require ("./routes/user.js");


app.set ("view engine", "ejs");
app.set ("views", path.join (__dirname, "views"));
app.use (express.urlencoded ({extended: true})); // url encodede bej sakta hai form me image
app.use (methodOverride ("_method"));
app.engine ('ejs', ejsMate);
app.use (express.static (path.join (__dirname, "/public")));

//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

//MONGOOSE CONNECTION
main()
.then(() => {
    console.log ("Connected to DB");
})
.catch((err) => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);  
}

//MONGO SESSION STORE
const store = MongoStore.create({ 
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on ("error", () => {
    console.log ("ERROR in MONGO SESSION STORE", err);
});

//SESSION OPTION
const sessionOptions = {  
    store,  
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
    cookie: {
        expires: Date.now() +7 *24 *60 *60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

// app.get ("/" , (req,res) => {
//     res.send ("root is working");
// });

//SESSION OPTION KO USE
app.use(session(sessionOptions));
//FLASH KO USE
app.use (flash());

//PASSPORT AS A Middleware
app.use (passport.initialize());  //har req me passport initilize
app.use (passport.session());
passport.use (new LocalStrategy (User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use ((req,res,next) => {
    res.locals.success = req.flash("success"); //FLASH MIDDLEWARE
    res.locals.error = req.flash("error"); //FLASH MIDDLEWARE
    res.locals.currUser = req.user;  //req.user ko currUser ke variable me store
    next();
})

//DEMO USER FOR AUTENTHICATION
/*app.get ("/demouser", async(req,res) => {
    let fakeUser = new User ({
        email: "student@gmail.com",
        username: "delta-student",
    });
    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send (registeredUser);
})*/

app.use ("/listings", listingsRouter);  //listing.js
app.use ("/listings/:id/reviews", reviewsRouter) //utils-> review ko udar paste kiya hai
app.use ("/", userRouter); //utils-> user hai

//SAMPLE TESTING ROUTE
/*app.get ("/testListing", async (req,res) => {
    let sampleListing = new Listing ({
        title: "My New Villa",
        description: "By the beach",
        price: 1200,
        location: "Calagute ,Goa",
        contry: "India",
    });

    //saving the data
    await sampleListing.save();
    console.log ("sample was saved");
    res.send ("successful testing")
})*/


app.all ("*", (req,res,next) => {
    next (new ExpressError (404, "Page Not Found !"));
});

//ERROR HANDELING MIDLLEWARE
app.use ((err,req,res,next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    //res.status (statusCode).send (message);
    res.status(statusCode).render("error.ejs", {message});
});

// Phele ka error handling hai customize nahi hai
/*app.use ((err,req,res,next) => {
    res.send ("somethig went wrong !");
});*/


app.listen (8080, () => {
    console.log ("server is listening to port 8080");
});

