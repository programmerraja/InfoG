//node modules
const mongoose=require("mongoose");
const bcrypt = require ('bcrypt');
//models
const scammermodel=require("../models/Scammer");
const usermodel=require("../models/User");
//util
const {generateToken,sendPasswordReset,AppError,dbErrorHandler}=require("../util/util");

//handling GET /user/dashboard
function get(req,res){
		res.render("user",{user:req.user});
}

//handling GET /user/logout
function logout(req,res){
		req.session.destroy();
		res.redirect("/");
}

//handling GET /user/profile
function userProfile(req,res){
	res.render("userProfile",{user:req.user,
							  name:req.user.name,
							  password:req.user.password});
}

//handling POST /user/profile
async function postUserProfile(req,res){
	if(req.body.name && req.body.old_password){

      let {name,old_password,new_password}=req.body;
      let user_id=req.user._id;
      let user= await usermodel.findOne({_id:user_id});
      if (user) {

   		  if(bcrypt.compareSync(old_password,user.password)){
   		  	if(new_password){
   		  	    new_password=bcrypt.hashSync(new_password, 2);
   		  		user.name=name;
   		  		user.password=new_password;
   		  	}
   		  	else{
   		  	   user.name=name;
   		  	}
   		  	
   		  	user=await user.save().catch((err)=>
   		  								{
   		  									let error_msg=dbErrorHandler(err)
			         						res.render("userProfile",
			         						{
			         						user:req.user,
			          						name:req.user.name,
			          						error_msg:error_msg
			          						});
			         					});
   		  	if(user){
   		  		res.render("userProfile",{user:req.user,
										  name:user.name,
					 		 			  error_msg:"Sucess fully updated"});
   		  	} 
   		  	
   		 }
   		 else{
   		 	res.render("userProfile",{user:req.user,
   		 							 name:req.user.name,
							 		 password:req.user.password,
							 		 error_msg:"Password does not match"});
   		 }
   	}
   
  	}
}


//handling GET /scammer/id/:id
async function getScammer(req,res){

	if(req.params.id)
	{
		let _id=req.params.id;
		var scammer=await scammermodel.findOne({_id:_id});
		if(scammer){
			res.render("scammer",{scammer:scammer});
			return
		}
	}
	//if not render the 404 page
	res.render("error");
}

//handling GET /user/forget/password
async function forgetPassword(req,res){

		res.render("forgetPassword",{user:req.user});

}

//handling POST /user/forget/password
async  function postForgetPassword(req,res){

	if(req.body.email){
		let email=req.body.email;
		var user=await usermodel.findOne({email:email});
		if(user){
			let token=generateToken();
			let link=req.protocol+"://"+req.get("host")+"/user/reset/password/"+token;

			//we adding 20 mins to current date and converting in to mili sec
			let password_reset_expires=Date.now()+20*60*1000;	
			//updating the user token
			let new_user=await usermodel.findOneAndUpdate({_id:user._id},
														  {password_reset_token:token,
														   password_reset_expires:password_reset_expires});

			//sending mail to user
			let msg=await sendPasswordReset(user.email,user.name,link);
			//if msg send sucessfully 
			if(msg){
				res.json({status:"Sucess",msg:"Check your mail to reset the password"});
			}
			else{
				res.json({status:"Failed",msg:"Sorry Something went wrong. Please try again"});
			}
			return
		}
		res.json({status:"Failed",msg:"No user exit with given gmail"})
	}
}

//handling GET /user/reset/password
async function resetPassword(req,res){

		res.render("resetPassword",{user:req.user});
}

//handling POST /user/reset/password
async  function postResetPassword(req,res){
	
	let password_reset_token = req.params.id;
	let new_password=req.body.password;
	if(password_reset_token && new_password){
	
		//finding the user
		var user=await usermodel.findOne({password_reset_token:password_reset_token,
										 password_reset_expires:{$gt:Date.now()}});
		if(user){
			let hash = bcrypt.hashSync(new_password, 2);
			let new_user=await usermodel.findOneAndUpdate({_id:user._id},{password:hash});
			res.json({status:"Sucess",msg:"Password Updated"});
		}
		else{
			res.json({status:"Failed",msg:"Link Expires"});
		}
		return
	}
	res.status(400).json({status:"Failed",msg:"Link not found"});

}

async function emailVerified(req,res){
	let user_id =req.params.id;
	if(user_id){
		var user=await usermodel.findOne({_id:user_id});
		if(user){
			user.is_email_verified=true;
			new_user=await user.save();
			res.render("emailVerified",{user:req.user});
			return
		}
		res.render("error")
	}
}

module.exports={get,
				logout,
				userProfile,
				postUserProfile,
				getScammer,
				forgetPassword,
				postForgetPassword,
				resetPassword,
				postResetPassword,
				emailVerified
				}