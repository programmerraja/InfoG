//node modules
const express = require("express");
//controller
const signupController = require("../controllers/signup")
//middleware
const asyncHandler = require("../middleware/asyncHandler");
//router
const router = express.Router();

//routes start with /signup

router.get("/", signupController.get);
router.post("/", asyncHandler(signupController.post));

module.exports = router;