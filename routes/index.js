const user = require("./user");
const product = require("./product");
const category = require("./category");
const history = require("./history");

const router = require("express").Router();

router.use("/users", user);
router.use("/products", product);
router.use("/categories", category);
router.use("/transactions", history);

module.exports = router;