//node modules
const express = require("express");
//controller
const adminController = require("../controllers/admin")
//middleware
const asyncHandler = require("../middleware/asyncHandler");
const adminAuthHandler = require("../middleware/adminAuthHandler");

//routes
const router = express.Router();

//routes for /admin

router.get("/", adminController.get);
router.post("/", asyncHandler(adminController.post));


router.get("/dashboard", adminAuthHandler, adminController.getAdmin);

router.get("/users", adminAuthHandler, asyncHandler(adminController.getUsers));
router.get("/user/id/:id", adminAuthHandler, asyncHandler(adminController.getUserById));

router.post("/user/remove/", adminAuthHandler, asyncHandler(adminController.removeUserById));



module.exports = router;