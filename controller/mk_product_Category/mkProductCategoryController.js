const mkProductCategoryModel = require("../../models/mk_product_category/mkProductCategoryModel");

const createProductCategory = async (req, res) => {
  const { name, status, shop_id, cat_id } = req.body;
  console.log("================", req.body);
  try {
    const result = await mkProductCategoryModel.createProductCategory(
      name,
      status,
      shop_id,
      cat_id
    );

    console.log("result", result);
    res
      .status(200)
      .json({ message: "sub Category Created Sucessfully", result });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get all from mk_subcategories
const getAllProductCategory = async (req, res) => {
  try {
    const result = await mkProductCategoryModel.getAllProductCategory();
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createProductCategory,
  getAllProductCategory,
};
