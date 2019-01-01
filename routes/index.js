var express = require("express");
var router  = express.Router();
var User    = require("../models/user");
var passport= require("passport");

router.use(function(req,res,next){
    res.locals.currentUser=req.user;
     res.locals.message=req.flash("error");
    
    next();
});
router.get("/login",function(req, res) {
   
    res.render("login");
});
router.post("/login",passport.authenticate("local",
{
    successRedirect:"/blogs",
    failureRedirect:"/login"
    }),function(req, res) {
    
});
router.get("/register",function(req, res) {
    res.render("register");
});
router.post("/register",function(req, res) {
    var  newuser=new User({username:req.body.username}) ;
    User.register(newuser,req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/blogs");
        });
    });
});
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("error","Logged you out!");
    res.redirect("/blogs");
});
router.get("/",function(req,res){
    res.render("landing");
});


module.exports=router;