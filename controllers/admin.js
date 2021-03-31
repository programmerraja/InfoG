//node modules
const passport = require("passport");
//util
const {AppError}=require("../util/util");
//models
const scammermodel=require("../models/Scammer");
const usermodel=require("../models/User");

//handling GET /signin
function get(req,res) {
		res.render("signin",{link:"/admin"});
}

//handling POST /signin
async function post(req,res,next){
	passport.authenticate('local', function(err, user, info) {
    if (err) {
       return next(new AppError(err,500));
     }
     //if no user show the error.
    if (!user) { 
    	return res.render('signin',{error_msg:info.message,link:"/admin"});
    	}
    //if user sucessfully login we need to call manually the signin function
    req.logIn(user, function(err) {
      if (err) { 
       return next(new AppError(err,500));
      }
      //need to check if he is admin
      if(user.is_admin){
        return res.redirect("/admin/dashboard");
      }
      return res.render('signin',{error_msg:"You not a admin",link:"/admin"});
      
    });
  })(req, res, next);	
}

function getAdmin(req,res){
  res.render("admin");
}


async function getUsers(req,res){
      let users=await usermodel.find({});
      res.json({status:"Sucess",users:users});
}

async function getUserById(req,res){
  if(req.params.id){
      let id=req.params.id;
      let user=await usermodel.findOne({_id:id});
      res.json({status:"Sucess",user:user.scammer});
  }
  else{
    res.json({status:"Failure",error_msg:"Don't be fool!"})
  }
}

async function removeUserById(req,res){
  if(req.body.user_id){
      let user_id=req.body.user_id;
      let user=await usermodel.deleteOne({_id:user_id});
      res.json({status:"Sucess",error_msg:"sucessfully removed"});
  }
  else{
    res.json({status:"Failure",error_msg:"Don't be fool!"})
  }
}

module.exports={get,post,getUsers,getUserById,removeUserById,getAdmin};

