//for env
require("dotenv").config();

//node modules
const express = require("express");
const path = require("path");
const session = require('express-session');
const bodyParser = require("body-parser");
const MongoStore = require('connect-mongo').default;
const mongoSanitize = require('express-mongo-sanitize');
var xss = require('xss-clean')
const passport = require("./passport/setup");
//utils
const {
  AppError
} = require("./util/util");

//routers
const signinrouter = require("./routes/signin");
const signuprouter = require("./routes/signup");
const userrouter = require("./routes/user");
const apirouter = require("./api/api");
const tokenrouter = require("./routes/token")
const adminrouter = require("./routes/admin")

//db
const dbConnect = require("./dbconnect");
//middleware
const errorHandler = require("./middleware/errorHandler");
//app
const app = new express()

//middleware's
app.use(xss())
app.use(mongoSanitize());
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'anbbduwwebsdnnasjsboolovesssbxzsjsobdkdsdn',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  },
  store: MongoStore.create({
    mongoUrl: process.env.DBURL
  })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// setting value
app.set("view engine", "ejs");
app.set("views", "./views");

let port = process.env.PORT || 3000;

//connecting to db
async function connect() {
  await dbConnect();
  console.log("Db sucessfully connected");
}
connect();

//routing
app.use("/public", express.static(path.join(__dirname + "/public")));
app.use("/api", apirouter);
app.use("/signin", signinrouter);
app.use("/signup", signuprouter);
app.use("/user", userrouter);
app.use("/token", tokenrouter);
app.use("/admin", adminrouter);


app.get("/", (req, res, next) => {
  res.render("index", {
    user: req.user
  });
})

//error handler
app.use(errorHandler);

//404 page 
app.get("/*", (req, res) => {
  res.render("error");
})


process.on("uncaughtException", (e) => {
  console.log("uncaughtException", e)
});

app.listen(port, () => {
  console.log("Server started")
});