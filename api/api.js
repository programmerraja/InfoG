
//node modules
const express=require("express");
const crypto=require("crypto");
const mongoose=require("mongoose");

//models
const scammermodel=require("../models/Scammer");
const usermodel=require("../models/User");

//middleware
const authHandler=require("../middleware/authHandler");
const asyncHandler=require("../middleware/asyncHandler");
const checkMailVerified=require("../middleware/checkMailVerified");
//util
const {dbErrorHandler}=require("../util/util");

//routes
const router= express.Router();

router.post("/link",authHandler,checkMailVerified,asyncHandler(generateLink));
router.post("/remove",authHandler,checkMailVerified,asyncHandler(removeVictim));
router.get("/get",authHandler,checkMailVerified,asyncHandler(getVictim));

//function
async function generateLink(req,res)
{			
	let scammername=req.body.scammername;
	let redirect_link=req.body.redirect_link?req.body.redirect_link:"";
	//if user enter the scammer name
	if(scammername )
	{
		const token=crypto.randomBytes(5).toString("hex");
		try{
			//if the generated token is already avaliable.
			scammer=await scammermodel.findOne({token:token});
			if(scammer)
			{
						res.json({status:"Failed",error_msg:"Try again"});
			}
			else
			{
				 var user_id=req.user._id;
				 let scammer=new scammermodel({name:scammername,user_id:user_id,
				 								token:token,redirect_link:redirect_link});
				
				 scammer=scammer.save().catch((err)=>{
   		  									let error_msg=dbErrorHandler(err);
			         						res.json({status:"Failed",error_msg:error_msg});
			         					});
				
				if(scammer){										
				 		res.json({status:"Sucess","token":token});
				 		return;
				}
				else{
						res.json({status:"Failed",error_msg:"Try again"});
				}
				
			}
		}
		catch(err)
		{
			res.status(500).json({status:"Failed",error_msg:"Try again"});
		}
	}
	else
	{
		res.status(400).json({status:"Failed",error_msg:"No user name provided"});
	}
}

async function removeVictim(req,res)
{
	if(req.body.id){
		let {id}=req.body;
		let msg=await scammermodel.deleteOne({_id:id});

		//if we sucessfully removed the scammer 
		if(msg.ok){
					res.json({status:"Sucess"});
					return;
		}	
		res.status(500).json({status:"Failed",error_msg:"Something went wrong"});
	}
}

async function getVictim(req,res)
{
	let user_id=req.user._id;
	var scammer=await scammermodel.find({user_id:user_id});
	res.json({status:"Sucess","scammerdata":scammer});
}

module.exports=router;
