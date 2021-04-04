//node modules
const passport = require("passport");
//util
const {
    AppError
} = require("../util/util");


//handling GET /signin
function get(req, res) {
    if (!req.user) {
        //this is used to inform the msg the user account sucessfully created
        if (req.session.confirm_msg) {

            res.render("signin", {
                error_msg: req.session.confirm_msg
            });
        } else {
            res.render("signin");
        }
    } else {
        res.redirect("/user/dashboard");
    }
}

//handling POST /signin
async function post(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(new AppError(err, 500));
        }
        //if no user show the error.
        if (!user) {
            return res.render('signin', {
                error_msg: info.message
            });
        }
        //if user sucessfully login we need to call manually the signin function
        req.logIn(user, function (err) {
            if (err) {
                return next(new AppError(err, 500));
            }
            return res.redirect('/user/dashboard');
        });
    })(req, res, next);
}


module.exports = {
    get,
    post
};