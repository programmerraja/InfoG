//node modules
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//models
const User = require("../models/User");
//utill
const {
    AppError,
    logError
} = require("../util/util");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Local Strategy
passport.use(new LocalStrategy({
    usernameField: "email"
}, AuthUser));

async function AuthUser(email, password, done) {
    // Match User
    try {
        let user = await User.findOne({
            email: email
        });
        if (user) {
            let hash = user.password;
            if (bcrypt.compareSync(password, hash)) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: "Password does not match"
                });
            }
        } else {
            return done(null, false, {
                message: "No user exit with this email"
            });
        }
    } catch (err) {
        logError(err);
        return done(new AppError(err, 500));
    }
}
module.exports = passport;