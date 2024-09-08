const express = require("express");
const multer = require("multer");
const mkProductController = require("../../controller/mk_product/mkProductController");

var path = require("path");
const router = express.Router();

// Configure Multer for file uploads
var storage = multer.diskStorage({
  destination: "public/product/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
var upload = multer({ storage: storage });

router.post(
  "/createproduct",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "featuredImage", maxCount: 10 },
  ]),
  mkProductController.mkProductController
);

router.get("/getallproducts", mkProductController.getAllProductsController);
router.get("/getallproductbyShopId/:shop_id", mkProductController.getAllProductsbyShopId);

router.get("/productbyid/:id", mkProductController.getProductByIdController);
router.put(
  "/updateproduct/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "featuredImage", maxCount: 10 },
  ]),
  mkProductController.updateProduct
);
router.delete("/deleteproduct/:id", mkProductController.deleteProduct);
router.get(
  "/getallFeaturedProduct",
  mkProductController.getAllFeaturedProductsController
);

router.get(
  "/getProductImage/:id",
  mkProductController.getProductImageController
);

router.delete(
  "/deleteproductimages/:id",
  mkProductController.deleteProductImageController
);

router.get(
  "/productbyslug/:slug",
  mkProductController.getProductBySlugController
);

router.post("/createOrder", mkProductController.createOrder);
router.get("/getAllOrder",mkProductController.getAllOrderController)
router.get("/getAllOrderById/:id",mkProductController.getAllOrderByIDController);
router.delete("/deleteOrder/:id",mkProductController.deleteOrderController);
router.get("/getAllOrderStatus",mkProductController.getAllOrderStatus);
router.put("/updateOrderStatus/:id",mkProductController.updateOrderStatus);


router.get("/getTransactionRecord",mkProductController.getTransactionRecordController);


var storage = multer.diskStorage({
  destination: "public/discount/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

var uploads = multer({ storage: storage });  // Use 'storage' here instead of 'store'

router.post("/createDiscount", uploads.single("image"), mkProductController.createDiscountController);

router.get("/getDiscountProduct/:shop_id",mkProductController.getDiscountProductController);








module.exports = router;
