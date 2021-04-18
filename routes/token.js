//node modules
const express = require("express");
//controller
const tokenController = require("../controllers/token")
//middleware
const asyncHandler = require("../middleware/asyncHandler");
//routes
const router = express.Router();

//routes start with /token
router.get("/:token", asyncHandler(tokenController.get));

module.exports = router;