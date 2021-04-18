const mongoose = require("mongoose");

const {
  logError
} = require("./util/util");

async function dbConnect() {
  if (process.env.DBURL) {
    try {
      //connecting to mongodb
      await mongoose.connect(process.env.DBURL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      });
      isconnected = true;
    } catch (err) {
      logError(err);
    }
  } else {
    console.log("env value is not defined");
  }
}

module.exports = dbConnect;