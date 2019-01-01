var express = require("express");
var router  = express.Router();
var Blog        =     require("../models/blog");
var Comment     =     require("../models/comment");
var middleware    = require("../middleware");
router.use(function(req,res,next){
    res.locals.currentUser=req.user;
     res.locals.message=req.flash("error");
    next();
});
///edit comment button redirect to edit page 
// value le 
//put 



router.post("/:id",middleware.IsloggedIn,function(req,res){
    
    Blog.findById(req.params.id,function(err,blog){
      if(err)
      { 
          res.redirect("/blogs/:id");
      }else{
           
          Comment.create(req.body.comments,function(err,newComment){
          if(err)
          {console.log(err);
            res.redirect("/blogs/:id");
          }else{
               //add username and then save
               newComment.author.id=req.user._id;
               newComment.author.username=req.user.username;
               newComment.save();
              blog.comments.push(newComment);
              blog.save();
              res.redirect("/blogs/"+blog._id);
          }
    });
            
        }
    });
       
  });
  
router.get("/:id/comment/:comment._id/edit",function(req,res){
    res.render("commentedit");
});


module.exports=router;