var middlewareObj = {};
var Blog          = require("../models/blog");

middlewareObj.Owner= function(req,res,next){
    if(req.isAuthenticated())
    {Blog.findById(req.params.id,function(err,foundBlog){
        
       if(err)
       {
           res.redirect("back");
       }else{
            if(foundBlog.author.id.equals(req.user._id)){
               next();
            }
            else{ 
               res.send("You do not have permission");
            }
        }
        });
    }else{
       res.redirect("back");
         }
    
};
middlewareObj.IsloggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First!");
    res.redirect("/login");
};
module.exports = middlewareObj;