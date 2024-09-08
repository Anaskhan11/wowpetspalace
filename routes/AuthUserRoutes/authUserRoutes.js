var express = require("express");
var multer = require("multer");
var path = require("path");
var middleware = require("../../middleware/middleware.js");

var authUserController = require("../../controller/AuthUser/authUserController.js");

var router = express.Router();

var storage = multer.diskStorage({
  destination: "public/authUser/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
var upload = multer({ storage: storage });

router.post(
  "/registeruser",
  upload.single("image"),
  authUserController.registerUser
);
router.post("/signin", authUserController.signinUser);
router.get("/appusers", authUserController.getAllAppuser);
router.get("/appusersbyid/:id", authUserController.getAllAppuserById);

router.delete("/deleteuser/:id", authUserController.deleteAppUser);

module.exports = router;
