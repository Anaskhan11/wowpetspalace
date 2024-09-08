var express = require("express");
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
var pageRoutes = require("./routes/PageRoutes/pageRoutes.js");
var roleRoutes = require("./routes/Roles/RoleRoutes.js");
var permissionRoutes = require("./routes/Permission/PermissionRoutes.js");
var UserDetailsRoutes = require("./routes/User/UserDetailsRoutes.js");
var ArticleCategoryRoutes = require("./routes/CategoryRoute/ArticlesCategoryRoutes.js");
var cors = require("cors");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var categoryArticleRoute = require("./routes/CategoryRoute/CategoryArticleRoutes.js");
var breedsCategory = require("./routes/BreedRoutes/BreedCategory.js");
var authUserRoutes = require("./routes/AuthUserRoutes/authUserRoutes.js");
var AdvertisementRoutes = require("./routes/Advertisement/AdvertisementRoutes.js");
var sliderRoutes = require("./routes/Slider/sliderRoutes.js");
var privacyAndTermRoutes = require("./routes/PrivacyRoutes/privacyRoutes.js");
var contactUsRoutes = require("./routes/contactUsRoutes/contactUsRoutes.js");
var shopRoutes = require("./routes/shop/shopRoutes.js");
var mkProductCategoryRoutes = require("./routes/mk_product_category/mkProductCategoryRoutes.js");
var mkProductRoutes = require("./routes/mk_product/mkProductRoutes.js");

var stripeRoutes = require("./routes/StripePaymentRoutes/stripeRoutes.js");
dotenv.config({ path: "./config/Config.env" });

var app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(cookieParser());

app.use(
  session({
    secret: "HJSDHDSLDLSDJSL",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.static("public"));

// app.use("/dashboard/pages", pageRoutes);
// app.use("/dashboard/role", roleRoutes);
// app.use("/dashboard/permission", permissionRoutes);
// app.use("/dashboard/users", UserDetailsRoutes);
// app.use("/dashboard/article", ArticleCategoryRoutes);
// app.use("/dashboard/categoryarticle", categoryArticleRoute);
// app.use("/dashboard/breed", breedsCategory);
// app.use("/dashboard/slider", sliderRoutes);
// app.use("/dashboard/privacyAndTermRoutes", privacyAndTermRoutes);
// app.use("/dashboard/contact", contactUsRoutes);
// // User Routes
// app.use("/dashboard/authUser", authUserRoutes);
// app.use("/dashboard/advertisment", AdvertisementRoutes);
// app.use("/dashboard/shop", shopRoutes);
// app.use("/dashboard/subCategory", mkProductCategoryRoutes);
// app.use("/dashboard/product", mkProductRoutes);
// app.use('/dashboard/payment', stripeRoutes);

app.use("/pages", pageRoutes);
app.use("/role", roleRoutes);
app.use("/permission", permissionRoutes);
app.use("/users", UserDetailsRoutes);
app.use("/article", ArticleCategoryRoutes);
app.use("/categoryarticle", categoryArticleRoute);
app.use("/breed", breedsCategory);

app.use("/slider", sliderRoutes);
app.use("/privacyAndTermRoutes", privacyAndTermRoutes);
app.use("/contact", contactUsRoutes);

// User Routes
app.use("/authUser", authUserRoutes);
app.use("/advertisement", AdvertisementRoutes);
app.use("/shop", shopRoutes);
app.use("/subCategory", mkProductCategoryRoutes);
app.use("/product", mkProductRoutes);
app.use('/payment', stripeRoutes);

app.listen(process.env.PORT, function () {
  console.log("Server is Running on PORT " + process.env.PORT);
});
