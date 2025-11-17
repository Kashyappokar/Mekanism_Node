const { parse } = require("cookie");
const Product = require("../schema/product.schema");
const { ApiErrors } = require("../utils/ApiErrors");
const { ApiResponse } = require("../utils/ApiResponse");
const logger = require("../utils/logger");

const createProduct = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      logger.error(`Only admin can create products.`);
      return res
        .status(400)
        .json(new ApiErrors("User Role requirnment didn't match."));
    }

    const { name, description, price, category, stock } = req.body;
    const nameLowered = name.toLowerCase().trim();

    const checkExistanceProduct = await Product.findOne({ name: nameLowered });

    if (checkExistanceProduct) {
      logger.error(`Product is already added.`);
      return res.status(400).json(new ApiErrors("Product is already added."));
    }

    const productList = await Product.create({
      name,
      description,
      price,
      category,
      stock,
    });

    await productList.save();
    logger.info(`Product is successfully registered.`);
    res
      .status(201)
      .json(new ApiResponse("Product is successfully created.", productList));
  } 
  
  catch (error) {
    logger.error(`CreateProduct [Error: "${error.message}"]`);
    return res
      .status(500)
      .json(
        new ApiErrors(
          error.message ||
            "Error in creating Product list at the method CreateProduct."
        )
      );
  }
};

const getAllProduct = async (req, res) => {
  try {
    //pagination query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // filter query
    let query = {};
    const search = req.query.search;
    const filter = req.query.filter;

    if (search !== undefined && search !== "") {
      const regxSearch = { name: { $regex: search, $options: "i" } };
      query = regxSearch;
    }

    if (filter !== undefined && filter !== "") {
      const regxFilter = { category: { $regex: filter, $options: "i" } };
      query = { ...query, ...regxFilter };
    }

    const TotalItems = await Product.find(query).countDocuments();
    const items = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ price: "ascending" ? 1 : -1 });

    if (!items) {
      logger.error(`Product list is not found.`);
      res.status(500).json(new ApiErrors("Product List not Found."));
    }
    logger.info(`Product list successfully received.`);
    return res.json({
      items,
      currentPage: page,
      totalPage: Math.ceil(TotalItems / limit),
      TotalItems,
    });
  } 
  
  catch (error) {
    logger.error(`GetAllProduct [Error: "${error.message}"]`);
    return res
      .status(500)
      .json(
        new ApiErrors(error.message || "Error in getting all products list.")
      );
  }
};

const getSingleProductAndUpdate = async (req, res) => {
  try {
    const NewData = req.body;
    const user = req.user;

    if (user.role !== "admin") {
      logger.error(`User role is not allowed to make changes.`);
      return res
        .status(400)
        .json(new ApiErrors("User Role requirenmnt didn't match."));
    }

    const product = await Product.findByIdAndUpdate(req.params.id, NewData, {
      new: true,
    });

    if (!product) {
      logger.error(`Product didn't found.`);
      return res
        .status(400)
        .json(new ApiErrors("Product details doesn,t found."));
    }

    logger.info(`Product updated successfully.`);
    res
      .status(200)
      .json(new ApiResponse("Product details updated successfully.", product));
  } 
  
  catch (error) {
    logger.error(`GetSingleProductAndUpdate [Error: "${error.message}"]`);
    return res
      .status(500)
      .json(new ApiErrors(error.message || "Error while updateing product."));
  }
};

const getSingleProductAndDelete = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "admin") {
      logger.error(`User role is not allowed to delete product.`);
      return res
        .status(400)
        .json(new ApiErrors("User Role requirenmnt didn't match."));
    }

    const product = await Product.findById({ _id: req.params.id });

    if (!product) {
      logger.error(`Product not found.`);
      return res.status(400).json(new ApiErrors("Product not found."));
    }

    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deleteProduct) {
      logger.error(`product not found to delete.`);
      res.status(400).json(new ApiErrors("Product deletion error."));
    }

    logger.info(`Product was deleted successfully.`);
    res
      .status(200)
      .json(new ApiResponse("Product is Deleted Successfully.", deleteProduct));
  } 
  
  catch (error) {
    logger.error(`GetSingleProductAndDelete [Error: "${error.message}"]`);
    return res
      .status(400)
      .json(
        new ApiErrors(error.message || "Error in deleteProduct catch block.")
      );
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getSingleProductAndUpdate,
  getSingleProductAndDelete,
};
