var express     = require("express");
var router      = express.Router();
var Blog        = require("../models/blog");
var middleware    = require("../middleware");
router.use(function(req,res,next){
    res.locals.currentUser=req.user;
     res.locals.message=req.flash("error");
    next();
});
router.get("/new",middleware.IsloggedIn,function(req,res) {
    res.render("new");
});

router.get("/",function(req,res){
    if (req.query.search) {
       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Blog.find({},function(err,blogs){
        
        if (err){
            console.log(err);
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
    }else{
        Blog.find({},function(err,blogs){
        
        if (err){
            console.log(err);
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
    }
});
router.post("/",middleware.IsloggedIn,function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newblogs){
        newblogs.author.id=req.user._id;
        newblogs.author.username=req.user.username;
        newblogs.save();
        if(err)
        {
            res.send("new");
        }else{
            
            res.redirect("/blogs");
           
        }
    });

}); 

router.get("/:id",middleware.IsloggedIn,function(req, res) {
   Blog.findById(req.params.id).populate("comments").exec(function(err,foundBlog){
       if(err)
       {
           res.redirect("/blogs");
       }else{
           
           res.render("show",{blog:foundBlog});
       }
   });
});
router.get("/:id/edit",middleware.Owner,function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
    
       if(err)
       {
           res.redirect("/login");
       }else{
           res.render("edit",{blog:foundBlog});
        }
         
       });
   
});
router.put("/:id",middleware.Owner,function(req,res){
   req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
       if(err)
       {
           res.redirect("/blogs");
       }else{
           res.redirect("/blogs/:"+req.params.id);
       }
   });
});
router.delete("/:id",middleware.Owner,function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
      if(err)
      {
          res.redirect("/blogs");
      }else{
          res.redirect("/blogs");
      }
  });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports=router;
