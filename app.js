var express     =     require("express") ,
methodOverride  =     require("method-override"),
expressSanitizer=     require("express-sanitizer"),
    app         =     express(),
    passport    =     require("passport"),
LocalStrategy   =     require("passport-local"),
    User        =     require("./models/user"),
    mongoose    =     require("mongoose"),
    flash       =     require("connect-flash"),
    bodyParser  =     require('body-parser');
var commentRoute=     require("./routes/comments"),
    blogRoute   =     require("./routes/blogs"),
    authRoute   =     require("./routes/index");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

app.set("view engine","ejs");


mongoose.connect("mongodb://Aadish09:qwerty1234@ds243254.mlab.com:43254/myblog",{ useNewUrlParser: true});
app.use(require("express-session")({
    secret:"This is Aadish's blog",
    resave:false,
    saveUnitialized:false
    
}));
app.locals.moment = require('moment');
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use("/blogs",commentRoute);
app.use("/blogs",blogRoute);
app.use(authRoute);
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.message=req.flash("error");
    next();
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server is running!");
  
});
