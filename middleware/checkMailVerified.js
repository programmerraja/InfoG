function checkMailVerified(req, res, next) {
    if (req.user.is_email_verified) {
        next()
        return
    }
    res.json({
        "status": "Failed",
        error_msg: "Please verify your mail to use our services"
    });

    return;


}

module.exports = checkMailVerified;