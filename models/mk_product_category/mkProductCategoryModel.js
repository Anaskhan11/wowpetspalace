const db = require("../../config/DatabaseConnection");

const createProductCategory = (name, status, shop_id, cat_id) => {
  console.log("=====Modal", name, status, shop_id, cat_id);
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO mk_subcategories (name, status, shop_id, cat_id) VALUES (?,?,?,?)`;
    db.query(query, [name, status, shop_id, cat_id], (err, result) => {
      if (err) {
        reject(err);
      }
      console.log("resultssss", result);
      resolve(result);
    });
  });
};

// get all from mk_subcategories
const getAllProductCategory = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM mk_subcategories`;
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = {
  createProductCategory,
  getAllProductCategory,
};
