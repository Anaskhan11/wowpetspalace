var db = require("../../config/DatabaseConnection.js");



var signupUser = function (
 
  email,
  hashedPassword,
  image,
  status="active"
 
) {
  var checkQuery = "SELECT COUNT(*) AS count FROM user_signup WHERE email = ?";
  var insertQuery =
    `INSERT INTO user_signup (email, password,  user_profile_photo, status) VALUES (?, ?, ?, ?)`;
  var selectQuery = "SELECT * FROM user_signup WHERE id = LAST_INSERT_ID()";

  return new Promise((resolve, reject) => {
    db.query(checkQuery, [email], function (checkErr, checkResult) {
      if (checkErr) {
        reject(checkErr);
      } else {
        var count = checkResult[0].count;
        if (count > 0) {
          reject(new Error("Email already exists"));
        } else {
          db.query(
            insertQuery,
            [
              email, hashedPassword,  image, status, 
            ],
            function (insertErr) {
              if (insertErr) {
                reject(insertErr);
              } else {
                db.query(selectQuery, function (selectErr, result) {
                  if (selectErr) {
                    reject(selectErr);
                  } else {
                    resolve(result[0]);
                  }
                });
              }
            }
          );
        }
      }
    });
  });
};

// var signupUser = function (
//   firstName,
//   lastName,
//   email,
//   hashedPassword,
//   phoneNumber,
//   image,

 
//   billing_first_name,
//   billing_last_name,
//   billing_address_1,
//   billing_address_2,
//   billing_country,
//   billing_state,
//   billing_city,
//   billing_postal_code,
//   billing_email,
//   billing_phone,
//   shipping_first_name,
//   shipping_last_name,
//   shipping_address_1,
//   shipping_address_2,
//   shipping_country,
//   shipping_state,
//   shipping_city,
//   shipping_postal_code,
//   shipping_email,
//   shipping_phone
// ) {
//   var checkQuery = "SELECT COUNT(*) AS count FROM user_signup WHERE email = ?";
//   var insertQuery =
//     `INSERT INTO user_signup (
//       firstName, lastName, email, password, phoneNumber, user_profile_photo,
//       billing_first_name, billing_last_name, billing_address_1, billing_address_2, billing_country, billing_state, billing_city, billing_postal_code, billing_email, billing_phone,
//       shipping_first_name, shipping_last_name, shipping_address_1, shipping_address_2, shipping_country, shipping_state, shipping_city, shipping_postal_code, shipping_email, shipping_phone
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//   var selectQuery = "SELECT * FROM user_signup WHERE id = LAST_INSERT_ID()";

//   return new Promise((resolve, reject) => {
//     db.query(checkQuery, [email], function (checkErr, checkResult) {
//       console.log(checkResult,"model==========================")
//       if (checkErr) {
//         reject(checkErr);
//       } else {
//         var count = checkResult[0].count;
//         if (count > 0) {
//           reject(new Error("Email already exists"));
//         } else {
//           db.query(
//             insertQuery,
//             [
//               firstName, lastName, email, hashedPassword, phoneNumber, image,
//               billing_first_name, billing_last_name, billing_address_1, billing_address_2, billing_country, billing_state, billing_city, billing_postal_code, billing_email, billing_phone,
//               shipping_first_name, shipping_last_name, shipping_address_1, shipping_address_2, shipping_country, shipping_state, shipping_city, shipping_postal_code, shipping_email, shipping_phone
//             ],
//             function (insertErr) {
//               if (insertErr) {
//                 reject(insertErr);
//               } else {
//                 db.query(selectQuery, function (selectErr, result) {
//                   console.log(result,"model+++++++++++++++")
//                   if (selectErr) {
//                     reject(selectErr);
//                   } else {
//                     resolve({
//                       id: result[0].id,
//                       firstName: result[0].firstName,
//                       lastName: result[0].lastName,
//                       email: result[0].email,
//                       phoneNumber: result[0].phoneNumber,
                     
//                       billing_first_name: result[0].billing_first_name,
//                       billing_last_name: result[0].billing_last_name,
//                       billing_address_1: result[0].billing_address_1,
//                       billing_address_2: result[0].billing_address_2,
//                       billing_country: result[0].billing_country,
//                       billing_state: result[0].billing_state,
//                       billing_city: result[0].billing_city,
//                       billing_postal_code: result[0].billing_postal_code,
//                       billing_email: result[0].billing_email,
//                       billing_phone: result[0].billing_phone,
//                       shipping_first_name: result[0].shipping_first_name,
//                       shipping_last_name: result[0].shipping_last_name,
//                       shipping_address_1: result[0].shipping_address_1,
//                       shipping_address_2: result[0].shipping_address_2,
//                       shipping_country: result[0].shipping_country,
//                       shipping_state: result[0].shipping_state,
//                       shipping_city: result[0].shipping_city,
//                       shipping_postal_code: result[0].shipping_postal_code,
//                       shipping_email: result[0].shipping_email,
//                       shipping_phone: result[0].shipping_phone,
//                     });
//                   }
//                 });
//               }
//             }
//           );
//         }
//       }
//     });
//   });
// };

var updateUserAuthToken = function (userId, authToken) {
  var updateQuery = "UPDATE user_signup SET auth_token = ? WHERE id = ?";
  var selectQuery = "SELECT * FROM user_signup WHERE id = ?";

  return new Promise((resolve, reject) => {
    db.query(
      updateQuery,
      [authToken, userId],
      function (updateErr, updateResult) {
        if (updateErr) {
          reject(updateErr);
        } else {
          // Fetch the updated user data
          db.query(selectQuery, [userId], function (selectErr, result) {
            if (selectErr) {
              reject(selectErr);
            } else {
              // Resolve with the updated user data
              resolve({
               
                email: result[0].email,
        
               
                
                authToken: result[0].auth_token,
              });
            }
          });
        }
      }
    );
  });
};

var loginUser = function (email) {
  var query = "SELECT * FROM user_signup WHERE email = ?";

  return new Promise((resolve, reject) => {
    db.query(query, [email], function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(result);
        resolve(result[0]);
      }
    });
  });
};

var getAllAppUsers = () => {
  const query = `SELECT id,firstName,lastName,email, phoneNumber, image, status,token,devicetype, user_type from user_signup `;

  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

var getAllAppUsersById = (id) => {
    const query = `SELECT id,email, 	
billing_first_name,	
billing_last_name,

billing_company	,
billing_address_1	,
billing_address_2,	
billing_country,	
billing_state,
billing_city	,
billing_postal_code	,
billing_email	,
billing_phone	,
shipping_first_name,	
shipping_last_name	,
shipping_company	,
shipping_address_1,	
shipping_address_2,	
shipping_country	,
shipping_state,
shipping_city	,
shipping_postal_code,	
shipping_email	,
shipping_phone  from user_signup WHERE id = ? `;

    return new Promise((resolve, reject) => {
      db.query(query,[id], (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

var deleteAppUser = (id) => {
  const query = `DELETE FROM user_signup WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
// GET APP USER BY ID
var getAppUserByIdfordeleteImage = (id) => {
  const query = `SELECT * FROM user_signup WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
module.exports = {
  signupUser: signupUser,
  loginUser: loginUser,
  updateUserAuthToken: updateUserAuthToken,
  getAllAppUsers: getAllAppUsers,
  getAllAppUsersById: getAllAppUsersById,
  deleteAppUser: deleteAppUser,
  getAppUserByIdfordeleteImage: getAppUserByIdfordeleteImage,
};
