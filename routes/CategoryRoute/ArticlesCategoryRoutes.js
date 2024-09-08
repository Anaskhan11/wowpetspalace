var express = require("express");
var multer = require("multer");
var path = require("path");

var ArticlesCategoryController = require("../../controller/Articles/ArticlesCategoryController.js");
var middleware = require("../../middleware/middleware.js");

var router = express.Router();
var storage = multer.diskStorage({
  destination: "public/articles/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
var upload = multer({ storage: storage });

router.post(
  "/addarticle",
  middleware.validateToken,
  upload.single("image"),
  ArticlesCategoryController.addArticle
);
router.get(
  "/getarticles/:page",
  // middleware.hasPermission,
  ArticlesCategoryController.getArticleCategory
);

router.post("/addtagsforarticle", ArticlesCategoryController.addTagsForArticle);

router.get(
  "/getalltags",
  // middleware.hasPermission,
  ArticlesCategoryController.getAllTags
);
router.get(
  "/getsinglearticlebyid/:slug",
  // middleware.hasPermission,
  ArticlesCategoryController.getSingleArticleById
);
router.get(
  "/showarticle",
  // middleware.hasPermission,
  ArticlesCategoryController.showArcticle
);
router.delete(
  "/deletearticle/:id",
  middleware.validateToken,
  ArticlesCategoryController.deleteArticleController
);
router.get(
  "/editarticle/:id",
  middleware.hasPermission,
  ArticlesCategoryController.getArticleById
);
router.get(
  "/getcategorybyid/:id",
  //  middleware.hasPermission,
  ArticlesCategoryController.getArticleByCategoryid
);
router.get(
  "/profilearticle/:id",
  //  middleware.hasPermission,
  ArticlesCategoryController.getArticleInProfileController
);
router.get(
  "/get10articles",
  //  middleware.hasPermission,
  ArticlesCategoryController.get10ArticleCategory
);
router.put(
  "/updatearticle/:id",
  middleware.validateToken,
  upload.single("image"),
  ArticlesCategoryController.updateArticleController
);

// search by title route
router.get(
  "/search/:title",
  // middleware.hasPermission,
  ArticlesCategoryController.searchArticle
);

module.exports = router;
