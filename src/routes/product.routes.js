const express = require("express");
const {
  createProduct,
  getAllProduct,
  getSingleProductAndUpdate,
  getSingleProductAndDelete,
} = require("../controllers/product.controller");
const loggedIn = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/", loggedIn, createProduct);
router.get("/", getAllProduct);
router.patch("/update/:id", loggedIn, getSingleProductAndUpdate);
router.delete("/delete/:id", loggedIn, getSingleProductAndDelete);

module.exports = router;
