const {dbErrorHandler,logError}=require("../util/util");
function errorHandler(err,req,res,next){
	logError(err);
	//if not status code set 
	if(!err.status_code){
		err.status_code=500;
	}
	if(process.env.NODE_ENV==="PRODUCTION"){

		let error_msg=dbErrorHandler(err);
		res.status(err.status_code).json({status:"Failure",error_msg:error_msg});
	}
	else if(process.env.NODE_ENV==="DEVELPMENT"){
		res.status(err.status_code).json({status:"Failure","msg":err.message,error:err});
	}
}

module.exports=errorHandler;