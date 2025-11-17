const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const emailvalidator = require("email-validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  role: {
    type: String,
    eNum: ["admin", "user"],
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.pre("save", async function (next) {
  const validatedEmail = emailvalidator.validate(this.email);

  if (validatedEmail == false) {
    const err = new Error("Enter email in proper formate.");
    err.status = 400;
    return next(err);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
