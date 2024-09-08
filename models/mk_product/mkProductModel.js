const db = require('../../config/DatabaseConnection');

const mkProductModel = (
    shop_id,
    cat_id,
    sub_cat_id,
    slug,
    name,
    description,
    original_price,
    search_tag,
    highlight_information,
    is_featured,
    is_available,
    code,
    status,
    added_user_id,
    shipping_cost,
    minimum_order,
    product_unit,
    product_measurement,
    colors,
    imagePaths, // Receive image paths
    featuredImage
) => {
    return new Promise((resolve, reject) => {
        db.beginTransaction((err) => {
            if (err) {
                console.error('Transaction start error:', err);
                return reject(err);
            }

            const query = `INSERT INTO mk_products(
        shop_id, cat_id, sub_cat_id,  slug, name, description,
        original_price, search_tag, highlight_information, is_featured,featured_image,
        is_available, code, status, added_user_id, shipping_cost,
        minimum_order, product_unit, product_measurement
      ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

            const values = [
                shop_id,
                cat_id,
                sub_cat_id,
                slug,
                name,
                description,
                original_price,
                search_tag,
                highlight_information,
                is_featured,
                featuredImage,
                is_available,
                code,
                status,
                added_user_id,
                shipping_cost,
                minimum_order,
                product_unit,
                product_measurement
            ];

            db.query(query, values, (err, result) => {
                if (err) {
                    console.error('Product insert error:', err);
                    return db.rollback(() => {
                        reject(err);
                    });
                }

                const productId = result.insertId;

                const colorQueries = colors.map((color) => {
                    return new Promise((resolve, reject) => {
                        const colorQuery = `INSERT INTO mk_products_colors(product_id, color_value) VALUES (?, ?)`;
                        db.query(
                            colorQuery,
                            [productId, color],
                            (err, result) => {
                                if (err) {
                                    console.error(
                                        'Color insert error for color:',
                                        color,
                                        err
                                    );
                                    return reject(err);
                                }
                                resolve(result);
                            }
                        );
                    });
                });

                const imageQueries = imagePaths.map((path) => {
                    return new Promise((resolve, reject) => {
                        const imageQuery = `INSERT INTO mk_product_images(product_id, image) VALUES ( ?, ?)`;
                        db.query(
                            imageQuery,
                            [productId, path],
                            (err, result) => {
                                if (err) {
                                    console.error(
                                        'Image insert error for path:',
                                        path,
                                        err
                                    );
                                    return reject(err);
                                }
                                resolve(result);
                            }
                        );
                    });
                });

                Promise.all([...colorQueries, ...imageQueries])
                    .then((results) => {
                        db.commit((err) => {
                            if (err) {
                                console.error('Transaction commit error:', err);
                                return db.rollback(() => {
                                    reject(err);
                                });
                            }
                            resolve({ product: result, colors: results });
                        });
                    })
                    .catch((err) => {
                        console.error('Insert errors:', err);
                        db.rollback(() => {
                            reject(err);
                        });
                    });
            });
        });
    });
};

// get all products with relation colors and category and sub category and shop

const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT
        p.*,
        GROUP_CONCAT(DISTINCT c.color_value) AS colors,
        GROUP_CONCAT(DISTINCT img.image) AS images,
        cat.title AS categoryTitle,
        sub.name AS subCategory,
        s.name AS shopName
      FROM mk_products AS p
      LEFT JOIN mk_products_colors AS c ON p.id = c.product_id
      LEFT JOIN breedcategory AS cat ON p.cat_id = cat.id
      LEFT JOIN mk_subcategories AS sub ON p.sub_cat_id = sub.id
      LEFT JOIN mk_shops AS s ON p.shop_id = s.id
      LEFT JOIN mk_product_images AS img ON p.id = img.product_id
      GROUP BY p.id
    `;

        db.query(query, (err, result) => {
            if (err) {
                console.error('Get all products error:', err);
                return reject(err);
            }

            const products = result.map((product) => {
                const colors = product.colors ? product.colors.split(',') : [];
                const images = product.images ? product.images.split(',') : [];
                return { ...product, colors, images };
            });

            resolve(products);
        });
    });
};

const getAllProductsByShopId = (shop_id) => {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT
        p.*,
        GROUP_CONCAT(DISTINCT c.color_value) AS colors,
        GROUP_CONCAT(DISTINCT img.image) AS images,
        cat.title AS categoryTitle,
        sub.name AS subCategory,
        s.name AS shopName
      FROM mk_products AS p
      LEFT JOIN mk_products_colors AS c ON p.id = c.product_id
      LEFT JOIN breedcategory AS cat ON p.cat_id = cat.id
      LEFT JOIN mk_subcategories AS sub ON p.sub_cat_id = sub.id
      LEFT JOIN mk_shops AS s ON p.shop_id = s.id
      LEFT JOIN mk_product_images AS img ON p.id = img.product_id
      WHERE p.shop_id = ?
      GROUP BY p.id
    `;

        db.query(query, [shop_id], (err, result) => {
            if (err) {
                console.error('Get all products by shop_id error:', err);
                return reject(err);
            }

            const products = result.map((product) => {
                const colors = product.colors ? product.colors.split(',') : [];
                const images = product.images ? product.images.split(',') : [];
                return { ...product, colors, images };
            });

            resolve(products);
        });
    });
};


const getProductById = (productId) => {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT
        p.*,
        GROUP_CONCAT(DISTINCT c.color_value) AS colors,
        GROUP_CONCAT(DISTINCT img.image) AS images,
        cat.title AS categoryTitle,
        sub.name AS subCategory,
        s.name AS shopName
      FROM mk_products AS p
      LEFT JOIN mk_products_colors AS c ON p.id = c.product_id
      LEFT JOIN breedcategory AS cat ON p.cat_id = cat.id
      LEFT JOIN mk_subcategories AS sub ON p.sub_cat_id = sub.id
      LEFT JOIN mk_shops AS s ON p.shop_id = s.id
      LEFT JOIN mk_product_images AS img ON p.id = img.product_id
      WHERE p.id = ?
      GROUP BY p.id
    `;

        db.query(query, [productId], (err, result) => {
            if (err) {
                console.error('Get product by ID error:', err);
                return reject(err);
            }

            if (result.length === 0) {
                return reject(new Error('Product not found'));
            }

            const product = result[0];
            const colors = product.colors ? product.colors.split(',') : [];
            const images = product.images ? product.images.split(',') : [];
            const formattedProduct = { ...product, colors, images };

            resolve(formattedProduct);
        });
    });
};
const updateProductById = (
    productId,
    shop_id,
    cat_id,
    sub_cat_id,
    slug,
    name,
    description,
    original_price,
    search_tag,
    highlight_information,
    is_featured,
    is_available,
    code,
    status,
    added_user_id,
    shipping_cost,
    minimum_order,
    product_unit,
    product_measurement,
    images,
    colors,
    featuredImage
) => {
    return new Promise((resolve, reject) => {
        const updateProductQuery = `
      UPDATE mk_products
      SET
        shop_id = ?,
        cat_id = ?,
        sub_cat_id = ?,
        slug = ?,
        name = ?,
        description = ?,
        original_price = ?,
        search_tag = ?,
        highlight_information = ?,
        is_featured = ?,
        featured_image = ?,
        is_available = ?,
        code = ?,
        status = ?,
        added_user_id = ?,
        shipping_cost = ?,
        minimum_order = ?,
        product_unit = ?,
        product_measurement = ?
      WHERE id = ?`;

        const deleteColorsQuery = `
      DELETE FROM mk_product_images
      WHERE product_id = ?`;

        const insertColorsQuery = `
      INSERT INTO mk_product_images (product_id, image)
      VALUES ?`;

        const deleteImagesQuery = `
      DELETE FROM mk_products_colors
      WHERE product_id = ?`;

        const insertImagesQuery = `
      INSERT INTO mk_products_colors (product_id, color_value)
      VALUES ?`;

        db.beginTransaction((err) => {
            if (err) return reject(err);

            db.query(
                updateProductQuery,
                [
                    shop_id,
                    cat_id,
                    sub_cat_id,
                    slug,
                    name,
                    description,
                    original_price,
                    search_tag,
                    highlight_information,
                    is_featured,
                    featuredImage,
                    is_available,
                    code,
                    status,
                    added_user_id,
                    shipping_cost,
                    minimum_order,
                    product_unit,
                    product_measurement,
                    productId
                ],
                (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            reject(err);
                        });
                    }

                    const updateColors = () => {
                        if (colors.length > 0) {
                            db.query(
                                deleteColorsQuery,
                                [productId],
                                (err, result) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            reject(err);
                                        });
                                    }

                                    const colorValues = colors.map((color) => [
                                        productId,
                                        color
                                    ]);
                                    db.query(
                                        insertColorsQuery,
                                        [colorValues],
                                        (err, result) => {
                                            if (err) {
                                                return db.rollback(() => {
                                                    reject(err);
                                                });
                                            }

                                            updateImages();
                                        }
                                    );
                                }
                            );
                        } else {
                            updateImages();
                        }
                    };

                    const updateImages = () => {
                        if (images.length > 0) {
                            db.query(
                                deleteImagesQuery,
                                [productId],
                                (err, result) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            reject(err);
                                        });
                                    }

                                    const imageValues = images.map((image) => [
                                        productId,
                                        image
                                    ]);
                                    db.query(
                                        insertImagesQuery,
                                        [imageValues],
                                        (err, result) => {
                                            if (err) {
                                                return db.rollback(() => {
                                                    reject(err);
                                                });
                                            }

                                            db.commit((err) => {
                                                if (err) {
                                                    return db.rollback(() => {
                                                        reject(err);
                                                    });
                                                }
                                                resolve(result);
                                            });
                                        }
                                    );
                                }
                            );
                        } else {
                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        reject(err);
                                    });
                                }
                                resolve(result);
                            });
                        }
                    };

                    updateColors();
                }
            );
        });
    });
};

const deleteProductById = (productId) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM mk_products WHERE id = ?';
        db.query(query, [productId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

const getAllFeaturedProducts = () => {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT
    p.*,
    GROUP_CONCAT(DISTINCT c.color_value) AS colors,
    GROUP_CONCAT(DISTINCT img.image) AS images,
    cat.title AS categoryTitle,
    sub.name AS subCategory,
    s.name AS shopName
FROM mk_products AS p
LEFT JOIN mk_products_colors AS c ON p.id = c.product_id
LEFT JOIN breedcategory AS cat ON p.cat_id = cat.id
LEFT JOIN mk_subcategories AS sub ON p.sub_cat_id = sub.id
LEFT JOIN mk_shops AS s ON p.shop_id = s.id
LEFT JOIN mk_product_images AS img ON p.id = img.product_id
WHERE p.is_featured = 1
GROUP BY p.id;

    `;

        db.query(query, (err, result) => {
            if (err) {
                console.error('Get all products error:', err);
                return reject(err);
            }

            console.log('Get all products result: ', result);

            const products = result.map((product) => {
                const colors = product.colors ? product.colors.split(',') : [];
                const images = product.images ? product.images.split(',') : [];
                return { ...product, colors, images };
            });

            resolve(products);
        });
    });
};

// get all images by product_id
const getProductImages = (productId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT image_id,image FROM mk_product_images WHERE product_id = ?`;
        db.query(query, [productId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// delete images from mk_product_images
const deleteProductImages = (id) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM mk_product_images WHERE image_id =?`;
        db.query(query, [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

var checkSlugExists = function (slug) {
    return new Promise(function (resolve, reject) {
        var sql = 'SELECT * FROM mk_products WHERE slug = ?';
        db.query(sql, [slug], function (err, result) {
            if (err) {
                console.error('Database query error:', err);
                reject(err);
            } else {
                resolve(result.length > 0);
            }
        });
    });
};

const getProductBySlug = (slug) => {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT
        p.*,
        GROUP_CONCAT(DISTINCT c.color_value) AS colors,
        GROUP_CONCAT(DISTINCT img.image) AS images,
        cat.title AS categoryTitle,
        sub.name AS subCategory,
        s.name AS shopName
      FROM mk_products AS p
      LEFT JOIN mk_products_colors AS c ON p.id = c.product_id
      LEFT JOIN breedcategory AS cat ON p.cat_id = cat.id
      LEFT JOIN mk_subcategories AS sub ON p.sub_cat_id = sub.id
      LEFT JOIN mk_shops AS s ON p.shop_id = s.id
      LEFT JOIN mk_product_images AS img ON p.id = img.product_id
      WHERE p.slug = ?
      GROUP BY p.id
    `;

        db.query(query, [slug], (err, result) => {
            if (err) {
                console.error('Get product by ID error:', err);
                return reject(err);
            }

            if (result.length === 0) {
                return reject(new Error('Product not found'));
            }

            const product = result[0];
            const colors = product.colors ? product.colors.split(',') : [];
            const images = product.images ? product.images.split(',') : [];
            const formattedProduct = { ...product, colors, images };

            resolve(formattedProduct);
        });
    });
};

const createOrderModel = (
    user_id,
    shop_id,
    sub_total_amount,
    shipping_amount,
    balance_amount,
    total_item_amount,
    total_item_count,
    contact_name,
    contact_phone,
    payment_method,
    added_user_id,
    trans_status_id,
    currency_symbol,
    currency_short_form,
    billing_first_name,
    billing_last_name,
    billing_company,
    billing_address_1,
    billing_address_2,
    billing_country,
    billing_state,
    billing_city,
    billing_postal_code,
    billing_email,
    billing_phone,
    shipping_first_name,
    shipping_last_name,
    shipping_company,
    shipping_address_1,
    shipping_address_2,
    shipping_country,
    shipping_state,
    shipping_city,
    shipping_postal_code,
    shipping_email,
    shipping_phone,
    product_id,
    original_price,
    price,
    qty,
    product_unit,
    shipping_cost
) => {
    return new Promise((resolve, reject) => {
        db.beginTransaction((err) => {
            if (err) return reject(err);

            const headerQuery = `INSERT INTO mk_transactions_header (
                user_id,
                shop_id,
                sub_total_amount,
                shipping_amount,
                balance_amount,
                total_item_amount,
                total_item_count,
                contact_name,
                contact_phone,
                payment_method,
                added_user_id,
                trans_status_id,
                currency_symbol,
                currency_short_form,
                billing_first_name,
                billing_last_name,
                billing_company,
                billing_address_1,
                billing_address_2,
                billing_country,
                billing_state,
                billing_city,
                billing_postal_code,
                billing_email,
                billing_phone,
                shipping_first_name,
                shipping_last_name,
                shipping_company,
                shipping_address_1,
                shipping_address_2,
                shipping_country,
                shipping_state,
                shipping_city,
                shipping_postal_code,
                shipping_email,
                shipping_phone
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

            const headerValues = [
                user_id,
                shop_id,
                sub_total_amount,
                shipping_amount,
                balance_amount,
                total_item_amount,
                total_item_count,
                contact_name,
                contact_phone,
                payment_method,
                added_user_id,
                trans_status_id,
                currency_symbol,
                currency_short_form,
                billing_first_name,
                billing_last_name,
                billing_company,
                billing_address_1,
                billing_address_2,
                billing_country,
                billing_state,
                billing_city,
                billing_postal_code,
                billing_email,
                billing_phone,
                shipping_first_name,
                shipping_last_name,
                shipping_company,
                shipping_address_1,
                shipping_address_2,
                shipping_country,
                shipping_state,
                shipping_city,
                shipping_postal_code,
                shipping_email,
                shipping_phone
            ];

            db.query(headerQuery, headerValues, (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        reject(err);
                    });
                }

                const header_id = result.insertId;

                const detailQuery = `INSERT INTO mk_transactions_detail (
                    shop_id,
                    transactions_header_id,
                    product_id,
                    original_price,
                    price,
                    qty,
                    added_user_id,
                    currency_symbol,
                    currency_short_form,
                    product_unit,
                    shipping_cost
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

                const detailValues = [
                    shop_id,
                    header_id,
                    product_id,
                    original_price,
                    price,
                    qty,
                    added_user_id,
                    currency_symbol,
                    currency_short_form,
                    product_unit,
                    shipping_cost
                ];

                db.query(detailQuery, detailValues, (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            reject(err);
                        });
                    }

                    // Update user_signup table
                    const updateSignupQuery = `UPDATE user_signup SET 
                        billing_first_name = ?,
                        billing_last_name = ?,
                        billing_company = ?,
                        billing_address_1 = ?,
                        billing_address_2 = ?,
                        billing_country = ?,
                        billing_state = ?,
                        billing_city = ?,
                        billing_postal_code = ?,
                        billing_email = ?,
                        billing_phone = ?,
                        shipping_first_name = ?,
                        shipping_last_name = ?,
                        shipping_company = ?,
                        shipping_address_1 = ?,
                        shipping_address_2 = ?,
                        shipping_country = ?,
                        shipping_state = ?,
                        shipping_city = ?,
                        shipping_postal_code = ?,
                        shipping_email = ?,
                        shipping_phone = ?
                    WHERE id = ?`;

                    const updateSignupValues = [
                        billing_first_name,
                        billing_last_name,
                        billing_company,
                        billing_address_1,
                        billing_address_2,
                        billing_country,
                        billing_state,
                        billing_city,
                        billing_postal_code,
                        billing_email,
                        billing_phone,
                        shipping_first_name,
                        shipping_last_name,
                        shipping_company,
                        shipping_address_1,
                        shipping_address_2,
                        shipping_country,
                        shipping_state,
                        shipping_city,
                        shipping_postal_code,
                        shipping_email,
                        shipping_phone,
                        user_id
                    ];

                    db.query(updateSignupQuery, updateSignupValues, (err, result) => {
                        if (err) {
                            return db.rollback(() => {
                                reject(err);
                            });
                        }

                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    reject(err);
                                });
                            }
                            resolve(result);
                        });
                    });
                });
            });
        });
    });
};

// const createOrderModel = (
//     user_id,
//     shop_id,
//     sub_total_amount,
//     shipping_amount,
//     balance_amount,
//     total_item_amount,
//     total_item_count,
//     contact_name,
//     contact_phone,
//     payment_method,
//     added_user_id,
//     trans_status_id,
//     currency_symbol,
//     currency_short_form,
//     billing_first_name,
//     billing_last_name,
//     billing_company,
//     billing_address_1,
//     billing_address_2,
//     billing_country,
//     billing_state,
//     billing_city,
//     billing_postal_code,
//     billing_email,
//     billing_phone,
//     shipping_first_name,
//     shipping_last_name,
//     shipping_company,
//     shipping_address_1,
//     shipping_address_2,
//     shipping_country,
//     shipping_state,
//     shipping_city,
//     shipping_postal_code,
//     shipping_email,
//     shipping_phone,
//     product_id,
//     original_price,
//     price,
//     qty,
//     product_unit,
//     shipping_cost
// ) => {
//     return new Promise((resolve, reject) => {
//         db.beginTransaction((err) => {
//             if (err) return reject(err);

//             const headerQuery = `INSERT INTO mk_transactions_header (
//   user_id,
//   shop_id,
//   sub_total_amount,
//   shipping_amount,
//   balance_amount,
//   total_item_amount,
//   total_item_count,
//   contact_name,
//   contact_phone,
//   payment_method,
//   added_user_id,
//   trans_status_id,
//   currency_symbol,
//   currency_short_form,
//   billing_first_name,
//   billing_last_name,
//   billing_company,
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
//   shipping_company,
//   shipping_address_1,
//   shipping_address_2,
//   shipping_country,
//   shipping_state,
//   shipping_city,
//   shipping_postal_code,
//   shipping_email,
//   shipping_phone
// ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

//             const headerValues = [
//                 user_id,
//                 shop_id,
//                 sub_total_amount,
//                 shipping_amount,
//                 balance_amount,
//                 total_item_amount,
//                 total_item_count,
//                 contact_name,
//                 contact_phone,
//                 payment_method,
//                 added_user_id,
//                 trans_status_id,
//                 currency_symbol,
//                 currency_short_form,
//                 billing_first_name,
//                 billing_last_name,
//                 billing_company,
//                 billing_address_1,
//                 billing_address_2,
//                 billing_country,
//                 billing_state,
//                 billing_city,
//                 billing_postal_code,
//                 billing_email,
//                 billing_phone,
//                 shipping_first_name,
//                 shipping_last_name,
//                 shipping_company,
//                 shipping_address_1,
//                 shipping_address_2,
//                 shipping_country,
//                 shipping_state,
//                 shipping_city,
//                 shipping_postal_code,
//                 shipping_email,
//                 shipping_phone
//             ];

//             db.query(headerQuery, headerValues, (err, result) => {
//                 if (err) {
//                     return db.rollback(() => {
//                         reject(err);
//                     });
//                 }

//             const header_id = result.insertId
               
//                 const detailQuery = `INSERT INTO mk_transactions_detail (
//   shop_id,
//  transactions_header_id,
//   product_id,
//   original_price,
//   price,
//   qty,
//   added_user_id,
//   currency_symbol,
//   currency_short_form,
//   product_unit,
//   shipping_cost
// ) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

//                 const detailValues = [
//                     shop_id,
//                    header_id,
//                     product_id,
//                     original_price,
//                     price,
//                     qty,
//                     added_user_id,
//                     currency_symbol,
//                     currency_short_form,
//                     product_unit,
//                     shipping_cost
//                 ];

//                 db.query(detailQuery, detailValues, (err, result) => {
//                     if (err) {
//                         return db.rollback(() => {
//                             reject(err);
//                         });
//                     }

//                     db.commit((err) => {
//                         if (err) {
//                             return db.rollback(() => {
//                                 reject(err);
//                             });
//                         }
//                         resolve(result);
//                     });
//                 });
//             });
//         });
//     });
// };

const getAllOrdersModel = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT 
                h.id AS transaction_id,
                h.added_date,
                h.sub_total_amount,
                h.shipping_amount,
                h.total_item_count,
                h.contact_name,
                h.contact_phone,
                d.original_price,
                d.product_unit,
                d.qty AS quantity,
                p.name AS productName,
                s.id AS shopId,
                s.name AS shopName,
                s.description AS shopDescription,
                s.email AS shopEmail,
                u.email,
                u.firstName,
                u.lastName ,
                mk.image,
                ts.title AS statusTitle

            FROM mk_transactions_header AS h
            LEFT JOIN mk_transactions_status AS ts ON h.trans_status_id = ts.id
            LEFT JOIN mk_transactions_detail AS d ON h.id = d.id
            LEFT JOIN mk_shops AS s ON h.shop_id = s.id
            LEFT JOIN user_signup AS u ON h.user_id = u.id
            LEFT JOIN mk_products AS p ON d.product_id = p.id
            LEFT JOIN mk_product_images AS mk ON p.id = mk.product_id
            
            `;

        db.query(query, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    });
};
const getAllOrdersModelById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                h.id AS orderId,
                h.*, 
                d.original_price,
                d.product_unit,
                d.qty,
                d.shipping_cost,
                p.id AS productId,
                p.name AS productName,
                s.id AS shopId,
                s.name AS shopName,
                s.description AS shopDescription,
                s.email AS shopEmail,
                u.email AS userEmail,
                u.firstName,
                u.lastName,
                mk.image,
                ts.title AS statusTitle
            FROM mk_transactions_header AS h
            LEFT JOIN mk_transactions_status AS ts ON h.trans_status_id = ts.id
            LEFT JOIN mk_transactions_detail AS d ON h.id = d.id
            LEFT JOIN mk_shops AS s ON h.shop_id = s.id
            LEFT JOIN user_signup AS u ON h.user_id = u.id
            LEFT JOIN mk_products AS p ON d.product_id = p.id
            LEFT JOIN mk_product_images AS mk ON p.id = mk.product_id
            WHERE h.id = ?
        `;

        db.query(query, [id], (error, results) => {
            if (error) {
                return reject(error);
            }

            if (results.length === 0) {
                return resolve(null); // Handle no results
            }

            const order = {
                orderId: results[0].orderId,
                ...results[0],
                products: [],
            };

            results.forEach(row => {
                const product = {
                    productId: row.productId,
                    productName: row.productName,
                    originalPrice: row.original_price,
                    productUnit: row.product_unit,
                    quantity: row.quantity,
                    image: row.image,
                };

                order.products.push(product);
            });

            resolve(order);
        });
    });
};

// delete orders
const deleteOrders = (id) =>{
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM mk_transactions_header WHERE id =?`;
        db.query(query, [id], (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
            });
        })
}
    
const getOrderStatus = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM mk_transactions_status`;
        db.query(query, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });

}


const updateOrderStatus = (id, status) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE mk_transactions_header SET trans_status_id = ? WHERE id = ?`;
        db.query(query, [status, id], (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
};




const getTransactionRecord = () =>{
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM transaction_record WHERE order_id IS NOT NULL`;
        db.query(query, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}


//create discount model 

// const createDiscount = (shop_id, name, discount, isPublish, image, productId) => {
//     return new Promise((resolve, reject) => {
//         db.beginTransaction((err) => {
//             if (err) {
//                 return reject(err);
//             }

//             // Insert into mk_discounts
//             const discountQuery = `INSERT INTO mk_discounts (shop_id, name, percent, status) VALUES (?, ?, ?, ?)`;
//             const discountValues = [shop_id, name, discount, isPublish];

//             db.query(discountQuery, discountValues, (error, result) => {
//                 if (error) {
//                     return db.rollback(() => reject(error));
//                 }

//                 const discountId = result.insertId; // Get the inserted discount ID

//                 // Insert into mk_discount_image
//                 const imageQuery = `INSERT INTO mk_discount_image (discount_id, image) VALUES (?, ?)`;
//                 const imageValues = [discountId, image];

//                 db.query(imageQuery, imageValues, (imageErr, imageResult) => {
//                     if (imageErr) {
//                         return db.rollback(() => reject(imageErr));
//                     }

//                     // Insert into mk_products_discount
//                     const productDiscountQuery = `INSERT INTO mk_products_discount (discount_id, product_id) VALUES (?, ?)`;
//                     const productDiscountValues = [discountId, productId];

//                     db.query(productDiscountQuery, productDiscountValues, (productErr, productResult) => {
//                         if (productErr) {
//                             return db.rollback(() => reject(productErr));
//                         }

//                         db.commit((commitErr) => {
//                             if (commitErr) {
//                                 return db.rollback(() => reject(commitErr));
//                             }
//                             resolve({ discountId, message: 'Discount created successfully!' });
//                         });
//                     });
//                 });
//             });
//         });
//     });
// };
const createDiscount = (shop_id, name, discount, isPublish, image, productIds) => {
    return new Promise((resolve, reject) => {
        db.beginTransaction((err) => {
            if (err) {
                return reject(err);
            }

            // Insert into mk_discounts
            const discountQuery = `INSERT INTO mk_discounts (shop_id, name, percent, status) VALUES (?, ?, ?, ?)`;
            const discountValues = [shop_id, name, discount, isPublish];

            db.query(discountQuery, discountValues, (error, result) => {
                if (error) {
                    return db.rollback(() => reject(error));
                }

                const discountId = result.insertId; // Get the inserted discount ID

                // Insert into mk_discount_image
                const imageQuery = `INSERT INTO mk_discount_image (discount_id, image) VALUES (?, ?)`;
                const imageValues = [discountId, image];

                db.query(imageQuery, imageValues, (imageErr, imageResult) => {
                    if (imageErr) {
                        return db.rollback(() => reject(imageErr));
                    }

                    // Loop through product IDs and insert into mk_products_discount
                    const productDiscountQuery = `INSERT INTO mk_products_discount (discount_id, product_id) VALUES (?, ?)`;
                    const productPromises = productIds.map((productId) => {
                        return new Promise((resolveProduct, rejectProduct) => {
                            db.query(productDiscountQuery, [discountId, productId], (productErr, productResult) => {
                                if (productErr) {
                                    return rejectProduct(productErr);
                                }
                                resolveProduct(productResult);
                            });
                        });
                    });

                    // Wait for all product insertions to complete
                    Promise.all(productPromises)
                        .then(() => {
                            db.commit((commitErr) => {
                                if (commitErr) {
                                    return db.rollback(() => reject(commitErr));
                                }
                                resolve({ discountId, message: 'Discount created successfully!' });
                            });
                        })
                        .catch((productErr) => {
                            return db.rollback(() => reject(productErr));
                        });
                });
            });
        });
    });
};


const getDiscountsProducts = (shopId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT d.name, d.percent, d.status, i.image, p.product_id
            FROM mk_discounts AS d
            JOIN mk_discount_image AS i ON d.id = i.discount_id
            JOIN mk_products_discount AS p ON d.id = p.discount_id
            JOIN mk_products AS prod ON p.product_id = prod.id
            WHERE prod.shop_id = ?;
        `;
        
        db.query(query, [shopId], (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}






module.exports = {
    mkProductModel,
    getAllProducts,
    getAllProductsByShopId,
    getProductById,
    updateProductById,
    deleteProductById,
    getAllFeaturedProducts,
    getProductImages,
    deleteProductImages,
    checkSlugExists,
    getProductBySlug,
    createOrderModel,
    getAllOrdersModel,
    getAllOrdersModelById,
    deleteOrders,
    getOrderStatus,
    updateOrderStatus,
   
    getTransactionRecord,

    createDiscount,
    getDiscountsProducts
    
    
};
