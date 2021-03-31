function adminAuthHandler(req,res,next){
		console.log(req.user)
		if(req.user && req.user.is_admin){
			next()
	
		}
		else{
			res.redirect("/");
		}

}

module.exports=adminAuthHandler;	