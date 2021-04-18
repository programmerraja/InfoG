//nodemodules
const express = require("express");
const userController = require("../controllers/user")
//middleware
const authHandler = require("../middleware/authHandler");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

//routes start with /user

router.get("/dashboard", authHandler, userController.get);

router.get("/logout", userController.logout);

router.get("/profile", authHandler, userController.userProfile);
router.post("/profile", authHandler, asyncHandler(userController.postUserProfile));


router.get("/verifiy/email/:id", asyncHandler(userController.emailVerified));

router.get("/scammer/id/:id", authHandler, asyncHandler(userController.getScammer));

router.get("/reset/password/:id", userController.resetPassword);
router.post("/reset/password/:id", asyncHandler(userController.postResetPassword));

router.get("/forget/password/", userController.forgetPassword);
router.post("/forget/password/", asyncHandler(userController.postForgetPassword));











module.exports = router;