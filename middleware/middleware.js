var jwt = require("jsonwebtoken");
const pagesModel = require("../models/Pages/PagesModel.js");

exports.createToken = function (user) {
  var accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      roleid: user.roleid,
    },
    "HJSDHDSLDLSDJSL",
    {
      expiresIn: "1hr",
    }
  );

  return accessToken;
};

exports.validateToken = function (req, res, next) {
  var accessToken = req.headers["authorization"];
  if (typeof accessToken !== "undefined") {
    var bearer = accessToken.split(" ");
    var token = bearer[1];
    jwt.verify(token, "HJSDHDSLDLSDJSL", function (err, data) {
      if (err) {
        res.status(401).json({ mssg: "Token invalid", err: err });
      } else {
        next();
        console.log("Authentication success");
      }
    });
  }
};

// frontend User token

exports.UserToken = function (user) {
  var token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    "HJSDHDSLDLSDJSL",
    {
      expiresIn: "10hr",
    }
  );

  return token;
};

// exports.hasPermission = function (req, res, next) {
//   var accessToken = req.headers["authorization"];
//   if (typeof accessToken !== "undefined") {
//     var bearer = accessToken.split(" ");
//     var token = bearer[1];
//     console.log("Token: ", token);
//     if (!token) {
//       res.status(401).json({ mssg: "Token invalid" });
//     }

//     jwt.verify(token, "HJSDHDSLDLSDJSL", function (err, decoded) {
//       if (err) {
//         console.error("Error decoding token:", err);
//       } else {
//         console.log("Decoded token payload:", decoded);
//         const { roleid } = decoded;
//         console.log("Role ID:", roleid);
//         pagesModel.getPagePermissionForRole(roleid).then((result) => {
//           if (result.length > 0) {
//             console.log("Permission granted");

//             // console.log("------------------------------------");
//             // console.log(result);

//             // console.log("------------------------------------");

//             const page = req.originalUrl.split("/")[1];
//             console.log("******************************************");
//             console.log(page);
//             console.log("******************************************");
//             console.log(typeof result[8]);

//             const permission = result.filter((p) => p.pageName === page);
//             console.log("===========================================");
//             console.log(result[7]);
//             if (permission) {
//               console.log("Permission granted", permission);
//               next();
//             } else {
//               console.log("Permission denied");
//               res.status(401).json({ mssg: "Permission denied" });
//             }
//           }
//         });
//       }
//     });
//   }
// };

exports.hasPermission = function (req, res, next) {
  var accessToken = req.headers["authorization"];
  if (typeof accessToken !== "undefined") {
    var bearer = accessToken.split(" ");
    var token = bearer[1];
    if (!token) {
      res.status(401).json({ mssg: "Token invalid" });
    }

    jwt.verify(token, "HJSDHDSLDLSDJSL", function (err, decoded) {
      if (err) {
        console.error("Error decoding token:", err);
      } else {
        console.log("Decoded token payload:", decoded);
        const { roleid } = decoded;
        console.log("Role ID:", roleid);
        pagesModel.getPagePermissionForRole(roleid).then((result) => {
          if (result.length > 0) {
            console.log("Permission granted");
            const isDuplicate = (arr, entry) => {
              return arr.some(
                (item) =>
                  item.id === entry.id &&
                  item.permissionid === entry.permissionid &&
                  item.pageid === entry.pageid
              );
            };

            // Use reduce to filter out duplicate entries
            const uniqueData = result.reduce((acc, entry) => {
              if (!isDuplicate(acc, entry)) {
                acc.push(entry);
              }
              return acc;
            }, []);

            const page = req.originalUrl.split("/")[1];
            console.log("******************************************");
            console.log(page);
            console.log("******************************************");

            const ourPermissions = uniqueData.find((p) => p.pageName === page);

            if (ourPermissions) {
              next();
            } else {
              console.log("Permission denied");
              res.status(401).json({ mssg: "Permission denied" });
            }
          }
        });
      }
    });
  }
};
