const User = require ("../models/user.js");

module.exports.renderSignupForm = (req,res) => {
    res.render ("./includes/users/signup.ejs");
};

module.exports.signup = async(req,res) => {
    try {
        let {username,email,password} = req.body;
        const newUser = new User ({email, username});
        //register
        const registeredUser = await User.register(newUser, password);
        console.log (registeredUser);
        req.login (registeredUser, (err) => { //signup ke baad direct login ho jaye
            if (err){
                return next (err);
            }
            //flash message
            req.flash ("sucess", "Welcome to Wanderlust !");
            res.redirect ("/listings");
        })        
    } catch (e){
        req.flash ("error", e.message);
        res.redirect ("/signup");
    }
}

module.exports.renderLoginform = (req,res) => {
    res.render ("./includes/users/login.ejs")
};

module.exports.login = async (req,res) => { //successful login ho jane ke baad kya karna hai actual login passport kara raha hai
    req.flash ("success", "Welcome back to wanderLust !");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect (redirectUrl);
    // res.send ("login succesfully")
};

module.exports.logout = (req,res,next) => {
    req.logout((err) => {
         if (err) {
             return next(err);
         }
         req.flash ("success", "You are Logout!");
         res.redirect ("/listings");
    })
};