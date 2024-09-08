var db = require("../../config/DatabaseConnection.js");

var showBreedsCategory = function (callback) {
  var query = "SELECT * FROM breedcategory ";
  db.query(query, function (err, result) {
    if (err) return callback(err, null);
    return callback(null, result);
  });
};

var insertBreedWithImage = function (
  title,
  slug,
  description,
  categoryid,
  imagePath,
  tags
) {
  console.log(tags);
  return new Promise(function (resolve, reject) {
    var conn = db;
    conn.beginTransaction(function (err) {
      if (err) {
        console.error("Error beginning transaction:", err);
        reject({
          success: false,
          message: "Internal server error",
        });
      } else {
        conn.query(
          "INSERT INTO breeds (title,slug, description, categoryid) VALUES (?,?, ?, ?)",
          [title, slug, description, categoryid],
          function (err, breedResult) {
            if (err) {
              console.error("Error inserting breed:", err);
              conn.rollback(function () {
                reject({
                  success: false,
                  message: "Internal server error",
                });
              });
            } else {
              var breedId = breedResult.insertId;

              if (imagePath && imagePath.length > 0) {
                var insertImagesQuery =
                  "INSERT INTO breedsimages (image, breed_id) VALUES ?";
                var values = imagePath.map(function (image) {
                  return [image, breedId];
                });

                console.log("Values: ", values);

                conn.query(insertImagesQuery, [values], function (err) {
                  if (err) {
                    console.error("Error inserting images:", err);
                    conn.rollback(function () {
                      reject({
                        success: false,
                        message: "Internal server error",
                      });
                    });
                  } else {
                    conn.commit(function (err) {
                      if (err) {
                        console.error("Error committing transaction:", err);
                        conn.rollback(function () {
                          reject({
                            success: false,
                            message: "Internal server error",
                          });
                        });
                      } else {
                        resolve({
                          success: true,
                          message: "Breed and images inserted successfully",
                          data: { breedId: breedId },
                        });
                      }
                    });
                  }
                });
              }
            }
          }
        );
      }
    });
  });
};

var updateBreedWithImage = function (
  title,
  description,
  categoryid,
  imagePath,
  id
) {
  var conn = db;
  var updateBreedResult;
  return new Promise(function (resolve, reject) {
    conn.beginTransaction(function (err) {
      if (err) {
        console.error("Error beginning transaction:", err);
        reject({
          success: false,
          message: "Internal server error",
        });
      } else {
        var checkCategoryIdQuery = "SELECT id FROM breedcategory WHERE id = ?";
        conn.query(checkCategoryIdQuery, [categoryid], function (err, result) {
          console.log("Check  category result", result);
          if (err) {
            console.error("Error checking categoryid:", err);
            conn.rollback(function () {
              reject({
                success: false,
                message: "Internal server error",
              });
            });
          } else {
            var categoryExists = result.length > 0;
            if (!categoryExists) {
              reject(
                new Error("Category with id " + categoryid + " does not exist")
              );
              return;
            }
            var updateBreedQuery =
              "UPDATE breeds SET title=?, description=?, categoryid=? WHERE id = ?";
            conn.query(
              updateBreedQuery,
              [title, description, categoryid, id],
              function (err, result) {
                console.log("Check result", result);
                if (err) {
                  console.error("Error updating breed:", err);
                  conn.rollback(function () {
                    reject({
                      success: false,
                      message: "Internal server error",
                    });
                  });
                } else {
                  updateBreedResult = result;
                  if (imagePath && imagePath.length > 0) {
                    var insertImagesQuery =
                      "INSERT INTO breedsimages (image, breed_id) VALUES (?, ?)";
                    var values = imagePath.map(function (image) {
                      return { image: image, id: id };
                    });
                    var _loop_1 = function (value) {
                      conn.query(
                        insertImagesQuery,
                        [value.image, value.id],
                        function (err) {
                          if (err) {
                            console.error("Error inserting images:", err);
                            conn.rollback(function () {
                              reject({
                                success: false,
                                message: "Internal server error",
                              });
                            });
                          }
                        }
                      );
                    };
                    for (
                      var _i = 0, values_1 = values;
                      _i < values_1.length;
                      _i++
                    ) {
                      var value = values_1[_i];
                      _loop_1(value);
                    }
                  }
                  conn.commit(function (err) {
                    if (err) {
                      console.error("Error committing transaction:", err);
                      conn.rollback(function () {
                        reject({
                          success: false,
                          message: "Internal server error",
                        });
                      });
                    } else {
                      resolve(updateBreedResult);
                    }
                  });
                }
              }
            );
          }
        });
      }
    });
  });
};

var showBreeds = function (page, limit, callback) {
  var query =
    "SELECT b.id AS breed_id, b.title AS breed_title, b.slug, b.description AS breed_description, bc.title AS category_title, GROUP_CONCAT(bi.image) AS breed_images FROM breeds b JOIN breedcategory bc ON b.categoryid = bc.id LEFT JOIN breedsimages bi ON b.id = bi.breed_id GROUP BY b.id, b.title, b.description, bc.title LIMIT ? OFFSET ?";
  var countQuery = "SELECT COUNT(*) AS total FROM breeds";
  // calculate the starting index
  var startIndex = (page - 1) * limit;
  db.query(countQuery, function (err, countResult) {
    if (err) {
      return callback(err, null, null);
    }
    db.query(query, [limit, startIndex], function (err, result) {
      if (err) {
        return callback(err, null, null);
      }
      var processedResult = result.map(function (row) {
        return {
          breed_id: row.breed_id,
          breed_title: row.breed_title,
          slug: row.slug,
          breed_description: row.breed_description,
          category_title: row.category_title,
          breed_images: row.breed_images ? row.breed_images.split(",") : [],
        };
      });
      var total = countResult[0].total;
      return callback(null, processedResult, total);
    });
  });
};

// delete breed
var deleteBreed = function (id) {
  return new Promise(function (resolve, reject) {
    var query = "DELETE FROM breeds WHERE id = ?";
    db.query(query, [id], function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

var getBreedById = function (id) {
  var query =
    "SELECT b.id AS breed_id, b.title AS breed_title, b.slug, b.description AS breed_description,b.categoryid ,bc.title AS category_title, GROUP_CONCAT(bi.image) AS breed_images, GROUP_CONCAT(bi.id) AS id FROM breeds b JOIN breedcategory bc ON b.categoryid = bc.id LEFT JOIN breedsimages bi ON b.id = bi.breed_id WHERE b.id =? GROUP BY b.id, b.title, b.description, bc.title";

  var values = [id];

  return new Promise(function (resolve, reject) {
    db.query(query, values, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

var getBreedByIdfordelete = function (id) {
  var query =
    "SELECT b.id AS breed_id, b.title AS breed_title, b.description AS breed_description,b.categoryid ,bc.title AS category_title, GROUP_CONCAT(bi.image) AS breed_images, GROUP_CONCAT(bi.id) AS id FROM breeds b JOIN breedcategory bc ON b.categoryid = bc.id LEFT JOIN breedsimages bi ON b.id = bi.breed_id WHERE b.id =? GROUP BY b.id, b.title, b.description, bc.title";

  var values = [id];

  return new Promise(function (resolve, reject) {
    db.query(query, values, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// breed image from breedimages table
var deletesinglebreedimagebyid = function (id) {
  var query = "Delete FROM breedsimages WHERE id=?";

  var values = [Number(id)];

  return new Promise(function (resolve, reject) {
    db.query(query, values, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

var getbreedimagebyid = function (id) {
  var query = "Select * FROM breedsimages WHERE id=?";

  var values = [Number(id)];

  return new Promise(function (resolve, reject) {
    db.query(query, values, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// get breeds by category
var getBreedByCategory = function (id) {
  var query =
    "SELECT b.id AS breed_id, b.title AS breed_title, b.slug,b.description AS breed_description, bc.title AS category_title,  bc.id AS category_id, GROUP_CONCAT(bi.image SEPARATOR '|') AS breed_images FROM breeds b JOIN breedcategory bc ON b.categoryid = bc.id LEFT JOIN breedsimages bi ON b.id = bi.breed_id  GROUP BY b.id, b.title, b.description, bc.title";

  return new Promise(function (resolve, reject) {
    db.query(query, [id], function (err, result) {
      if (err) {
        reject(err);
      } else {
        var breeds = result.map(function (breed) {
          return {
            breed_id: breed.breed_id,
            breed_title: breed.breed_title,
            slug: breed.slug,
            breed_description: breed.breed_description,
            category_title: breed.category_title,
            breed_images: breed.breed_images.split("|"),
          };
        });
        resolve(breeds);
      }
    });
  });
};

// get breeds by categoryid
var getBreedByCategoryId = function (id, startIndex, limit) {
  var query =
    "SELECT b.id AS breed_id, b.title AS breed_title, b.slug, b.description AS breed_description, bc.title AS category_title,  bc.id AS category_id, GROUP_CONCAT(bi.image SEPARATOR '|') AS breed_images FROM breeds b JOIN breedcategory bc ON b.categoryid = bc.id LEFT JOIN breedsimages bi ON b.id = bi.breed_id WHERE b.categoryid = ? GROUP BY b.id, b.title, b.description, bc.title LIMIT ? OFFSET ?";
  var countQuery =
    "SELECT COUNT(*) as total FROM breeds b WHERE b.categoryid = ?";
  return new Promise(function (resolve, reject) {
    db.query(countQuery, [id], function (err, countResult) {
      if (err) {
        reject(err);
      } else {
        var totalRecords = countResult[0].total;
        var totalPages = Math.ceil(totalRecords / limit);
        db.query(query, [id, limit, startIndex], function (err, result) {
          if (err) {
            reject(err);
          } else {
            var breeds = result.map(function (breed) {
              return {
                breed_id: breed.breed_id,
                breed_title: breed.breed_title,
                slug: breed.slug,
                breed_description: breed.breed_description,
                category_title: breed.category_title,
                breed_images: breed.breed_images.split("|"),
              };
            });
            resolve({ breeds: breeds, totalPages: totalPages });
          }
        });
      }
    });
  });
};

const get10BreedsByCategory = () => {
  const query = `
  SELECT breed_id, breed_title,slug, breed_description, category_title, category_id, breed_images
FROM (
    SELECT  b.id AS breed_id,
            b.title AS breed_title,
            b.slug,
            b.description AS breed_description,
            bc.title AS category_title,
            bc.id AS category_id,
            GROUP_CONCAT(bi.image SEPARATOR '|') AS breed_images,
            ROW_NUMBER() OVER (PARTITION BY bc.id ORDER BY b.id DESC) AS rn
    FROM breeds b
    JOIN breedcategory AS bc ON b.categoryid = bc.id
    JOIN breedsimages AS bi ON b.id = bi.breed_id
    GROUP BY b.id, b.title, b.description, bc.title, bc.id
) AS subquery
WHERE rn <= 10
ORDER BY category_id, breed_id DESC;
    `;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const breeds = result.map((breed) => ({
          breed_id: breed.breed_id,
          breed_title: breed.breed_title,
          slug: breed.slug,
          breed_description: breed.breed_description,
          category_title: breed.category_title,
          breed_images: breed.breed_images.split("|"),
        }));
        resolve(breeds);
      }
    });
  });
};

const getSingleBreedById = (slug) => {
  const query = `
    SELECT
      b.id AS breed_id,
      b.title AS breed_title,
      b.slug,
      b.description AS breed_description,
      bc.title AS category_title,
      GROUP_CONCAT(bi.image SEPARATOR '|') AS breed_images
    FROM
      breeds AS b
      JOIN breedsimages AS bi ON b.id = bi.breed_id
      JOIN breedcategory AS bc ON b.categoryid = bc.id
    WHERE
      b.slug = ?
    GROUP BY
      b.id, b.title, b.slug, b.description, bc.title
  `;
  return new Promise((resolve, reject) => {
    db.query(query, [slug], (err, result) => {
      if (err) {
        reject(err);
      } else {
        console.log("Result", result);
        const breed = {
          breed_id: result[0].breed_id,
          breed_title: result[0].breed_title,
          slug: result[0].slug,
          breed_description: result[0].breed_description,
          category_title: result[0].category_title,
          breed_images: result[0].breed_images.split("|"),
        };
        console.log(breed, "breed model result");
        resolve(breed);
      }
    });
  });
};

// Tags

var addBreedTags = function (tags) {
  // here tags is an array of tags strings
  console.log("Model tags", tags);
  var values = tags.map((tag) => [tag]);
  var query = "INSERT INTO `all_breed_tags`(`name`) VALUES ?";
  return new Promise(function (resolve, reject) {
    db.query(query, [values], function (err, result) {
      if (err) {
        console.error("Error inserting tags:", err);
        reject(err);
      } else {
        console.log("Tags inserted successfully");
        resolve(result);
      }
    });
  });
};

var getAllTags = function () {
  var query = "SELECT * FROM all_breed_tags";
  return new Promise(function (resolve, reject) {
    db.query(query, function (err, result) {
      if (err) {
        console.error("Error fetching tags:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
module.exports = {
  showBreedsCategory: showBreedsCategory,
  insertBreedWithImage: insertBreedWithImage,
  showBreeds: showBreeds,
  updateBreedWithImage: updateBreedWithImage,
  deleteBreed: deleteBreed,
  getBreedById: getBreedById,
  deletesinglebreedimagebyid: deletesinglebreedimagebyid,
  getBreedByCategory: getBreedByCategory,
  get10BreedsByCategory: get10BreedsByCategory,
  getBreedByCategoryId: getBreedByCategoryId,
  getBreedByIdfordelete: getBreedByIdfordelete,
  getbreedimagebyid: getbreedimagebyid,
  getSingleBreedById,
  addBreedTags,
  getAllTags,
};
