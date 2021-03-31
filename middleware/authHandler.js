function authHandler(req,res,next){
	if(req.user){
		next()
		return
	}
	res.redirect("/signin");

}

module.exports=authHandler;	