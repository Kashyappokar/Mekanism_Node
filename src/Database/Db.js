const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { ApiErrors } = require("../utils/ApiErrors");
const { loggers } = require('../utils/logger');
dotenv.config();

const Db = async (req, res) => {
  try {
    await mongoose
      .connect(process.env.DATABASE_URL)
      .then(() => console.log("DataBase connected Successfully."));
  } 
    
  catch (error) {
    loggers.error(`Database connection Error: ["${error.message}"]`)
    return req.json(new ApiErrors(
      error.message
    ))
  }
};
module.exports = Db;
