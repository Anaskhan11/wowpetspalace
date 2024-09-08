const express = require("express");
const mkProductCategoryController = require("../../controller/mk_product_Category/mkProductCategoryController");

const router = express.Router();

router.post(
  "/createProductCategory",
  mkProductCategoryController.createProductCategory
);

router.get(
  "/getAllProductCategory",
  mkProductCategoryController.getAllProductCategory
);
module.exports = router;
