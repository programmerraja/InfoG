//node modules
const express = require("express");
//controller
const signinController = require("../controllers/signin");
//router
const router = express.Router();

//routes start with /signin

router.get("/", signinController.get);
router.post("/", signinController.post);


module.exports = router;