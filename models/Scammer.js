const mongoose=require("mongoose");


let schema=new mongoose.Schema(
								{
									user_id:{
										type:String
									},
									token:
									{
										type:String
									},
									name:
									{
										type:String
									},
									isvisited:
									{
										type:Boolean,
										default:false
									},
									ip:
									{
										type:String,
										default:""

									},
									city:
									{
										type:String,
										default:""
									},
									region:
									{
										type:String,
										default:""
									},
									country:
									{
										type:String,
										default:""
									},
									org:
									{
										type:String,
										default:""
									},	
								    device:
								    {
										type:JSON,
										
									},														
								 	os:
								 	{
										type:String,
										default:""
									},									
									browser:
									{
										type:String,
										default:""									
									},									
									redirect_link:
									{
										type:String,
										default:""									
									},
									visited_date:{
										type:Date
									}
								}
								);


let scammermodel=new mongoose.model("scammer",schema);

module.exports=scammermodel;