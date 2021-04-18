const mongoose = require("mongoose");

let schema = new mongoose.Schema({
  name: {
    type: String
  },
  password: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  is_email_verified: {
    type: Boolean,
    default: false
  },
  password_reset_token: {
    type: String
  },
  password_reset_expires: {
    type: Date
  },
  is_admin: {
    type: Boolean,
    default: false
  },
  created_date: {
    type: Date,
    default: new Date()
  }
});


let user_model = new mongoose.model("user", schema);

module.exports = user_model;