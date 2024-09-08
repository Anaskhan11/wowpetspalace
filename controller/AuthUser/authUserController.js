var authUserModel = require("../../models/AuthUser/authUserModel.js");
var crypto = require("crypto");
var UserToken = require("../../middleware/middleware.js").UserToken;

var fs = require("fs");
var path = require("path");




exports.registerUser = function (req, res) {
  var 
    email = req.body.email,
    password = req.body.password
   

  var hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  var image = req.file ? "authUser/" + req.file.filename : "default.webp";

  authUserModel
    .signupUser(
     
      email,
      hashedPassword,
      image
    
    )
    .then((result) => {
      var authToken = UserToken(result);
      if (!authToken)
        return res.status(500).json({ message: "Token not generated!" });

      return authUserModel
        .updateUserAuthToken(result.id, authToken)
        .then((data) => {
          res.cookie("authToken", authToken);
          res.status(201).json({
            message: "User registered successfully",
            data: data,
          });
        });
    })
    .catch((err) => {
      if (err.sqlMessage && err.sqlMessage.includes("email")) {
        res.status(400).json({ message: "Email already exists!" });
      } else {
        res
          .status(500)
          .json({ message: "Internal server error!", error: err.message });
      }
    });
};

// exports.registerUser = function (req, res) {
//   var firstName = req.body.firstName,
//     lastName = req.body.lastName,
//     email = req.body.email,
//     password = req.body.password,
//     phoneNumber = req.body.phoneNumber,
   
//     user_type = req.body.user_type,
//     billing_first_name = req.body.billing_first_name,
//     billing_last_name = req.body.billing_last_name,
//     billing_address_1 = req.body.billing_address_1,
//     billing_address_2 = req.body.billing_address_2,
//     billing_country = req.body.billing_country,
//     billing_state = req.body.billing_state,
//     billing_city = req.body.billing_city,
//     billing_postal_code = req.body.billing_postal_code,
//     billing_email = req.body.billing_email,
//     billing_phone = req.body.billing_phone,
//     shipping_first_name = req.body.shipping_first_name,
//     shipping_last_name = req.body.shipping_last_name,
//     shipping_address_1 = req.body.shipping_address_1,
//     shipping_address_2 = req.body.shipping_address_2,
//     shipping_country = req.body.shipping_country,
//     shipping_state = req.body.shipping_state,
//     shipping_city = req.body.shipping_city,
//     shipping_postal_code = req.body.shipping_postal_code,
//     shipping_email = req.body.shipping_email,
//     shipping_phone = req.body.shipping_phone;

//   var hashedPassword = crypto
//     .createHash("sha256")
//     .update(password)
//     .digest("hex");

//   var image = req.file ? "authUser/" + req.file.filename : "default.webp";

//   authUserModel
//     .signupUser(
//       firstName,
//       lastName,
//       email,
//       hashedPassword,
//       phoneNumber,
//       image,
     
//       user_type,
//       billing_first_name,
//       billing_last_name,
//       billing_address_1,
//       billing_address_2,
//       billing_country,
//       billing_state,
//       billing_city,
//       billing_postal_code,
//       billing_email,
//       billing_phone,
//       shipping_first_name,
//       shipping_last_name,
//       shipping_address_1,
//       shipping_address_2,
//       shipping_country,
//       shipping_state,
//       shipping_city,
//       shipping_postal_code,
//       shipping_email,
//       shipping_phone
//     )
//     .then((result) => {
//       var authToken = UserToken(result);
//       if (!authToken)
//         return res.status(500).json({ message: "Token not generated!" });

//       return authUserModel
//         .updateUserAuthToken(result.id, authToken)
//         .then((data) => {
//           res.cookie("authToken", authToken);
//           res.status(201).json({
//             message: "User registered successfully",
//             data: data,
//           });
//         });
//     })
//     .catch((err) => {
//       if (err.sqlMessage && err.sqlMessage.includes("email")) {
//         res.status(400).json({ message: "Email already exists!" });
//       } else {
//         res
//           .status(500)
//           .json({ message: "Internal server error!", error: err.message });
//       }
//     });
// };

// exports.registerUser = function (req, res) {
//   var firstName = req.body.firstName,
//     lastName = req.body.lastName,
//     email = req.body.email,
//     password = req.body.password,
//     phoneNumber = req.body.phoneNumber,
//     status = req.body.status,
//     token = req.body.token,
//     devicetype = req.body.devicetype,
//     user_type = req.body.user_type;

//   var hashedPassword = crypto
//     .createHash("sha256")
//     .update(password)
//     .digest("hex");

//   var image = req.file ? "authUser/" + req.file.filename : "default.webp";

//   authUserModel
//     .signupUser(
//       firstName,
//       lastName,
//       email,
//       hashedPassword,
//       phoneNumber,
//       image,
//       status,
//       token,
//       devicetype,
//       user_type
//     )
//     .then((result) => {
//       var authToken = UserToken(result);
//       if (!authToken)
//         return res.status(500).json({ message: "Token not generated!" });

//       return authUserModel
//         .updateUserAuthToken(result.id, authToken)
//         .then((data) => {
//           res.cookie("authToken", authToken);
//           res.status(201).json({
//             message: "User registered successfully",
//             data: data,
//           });
//         });
//     })
//     .catch((err) => {
//       if (err.sqlMessage && err.sqlMessage.includes("email")) {
//         res.status(400).json({ message: "Email already exists!" });
//       } else {
//         res
//           .status(500)
//           .json({ message: "Internal server error!", error: err.message });
//       }
//     });
// };

exports.signinUser = function (req, res) {
  var email = req.body.email,
    password = req.body.password;

  console.log(email, password);

  authUserModel
    .loginUser(email)
    .then((user) => {
      if (!user || user.length === 0) {
        res.status(401).json({ error: "The User doenst exist" });
        return;
      }

      var hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      console.log("hashed password", hashedPassword);

      console.log("user password", user.password);

      if (hashedPassword !== user.password) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      var id = user.id,
        firstName = user.firstName,
        lastName = user.lastName,
        email = user.email,
        phoneNumber = user.phoneNumber,
        image = user.image,
        status = user.status,
        token = user.token,
        devicetype = user.devicetype,
        user_type = user.user_type;

      var authToken = UserToken(user);
      if (!authToken)
        return res.status(500).json({ message: "Token not generated!" });

      return authUserModel.updateUserAuthToken(id, authToken).then((data) => {
        res.json({
          message: "Login successful",
          data: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            image: image,
            status: status,
            token: token,
            devicetype: devicetype,
            user_type: user_type,
            authToken: authToken,
          },
        });
      });
    })
    .catch((err) => {
      console.error("Login error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getAllAppuser = async (req, res) => {
  try {
    const result = await authUserModel.getAllAppUsers();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

exports.getAllAppuserById = async (req, res) => {
    const user_id = req.params.id
    try {
      const result = await authUserModel.getAllAppUsersById(user_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Internal server error!" });
    }
  };

exports.deleteAppUser = async (req, res) => {
  const id = req.params.id;
  try {
    const result1 = await authUserModel.getAppUserByIdfordeleteImage(id);
    const image =
      result1[0] && result1[0].image ? result1[0].image : "default.png";
    console.log(__dirname, image);
    if (image && !image.includes("default.png")) {
      fs.unlink(path.join(__dirname, "../../public/", image), (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        }
      });
    }
    const result = await authUserModel.deleteAppUser(id);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};
