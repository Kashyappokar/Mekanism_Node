const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { ApiErrors } = require("../utils/ApiErrors");
dotenv.config();

const Db = async (req, res) => {
  try {
    await mongoose
      .connect(process.env.DATABASE_URL)
      .then(() => console.log("DataBase connected Successfully."));
  } 
    
  catch (error) {
    return res.json(new ApiErrors("Database Connection problem"));
  }
};
module.exports = Db;
