const express = require("express");
const UserRouter = require("./src/routes/user.routes");
const ProductRouter = require("./src/routes/product.routes");
const app = express();
const Db = require("./src/Database/Db");
const cookieparser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());
app.use(cookieparser());
Db();
app.get("/health", (req, res) => {
  console.log("Helloo its Working");
  res.send("Helloo its Working");
});
app.use("/api/users", UserRouter);
app.use("/api/products", ProductRouter);

app.listen(process.env.PORT || 8000, () => {
  console.log(`server is running on Port: ${process.env.PORT}`);
});
