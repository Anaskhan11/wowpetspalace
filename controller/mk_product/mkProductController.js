const mkProductModel = require("../../models/mk_product/mkProductModel");
const slugify = require("slugify");
const shopModel = require("../../models/shop/shopModel");
const authUserModel = require("../../models/AuthUser/authUserModel")
const nodemailer = require('nodemailer');
//const logTransaction = require('../../middleware/logTransaction');
// const stripe = require('stripe')(' sk_test_51Jn8daH8TsHWSDoWqTNC3fvCVl5bfx1JVCiujw46V50ZduF9aDVpmUZh0rG5KxPhcL21IhP33jgsmnrcy2gDFXlG00szN74p6N');

const mkProductController = async (req, res) => {
  const {
    shop_id,
    cat_id,
    sub_cat_id,
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
  } = req.body;

  // Handle file uploads
  const imageFiles = req.files.images || [];
  const featuredImageFile = req.files.featuredImage
    ? req.files.featuredImage[0]
    : null;
  const featuredImage = featuredImageFile
    ? "product/" + featuredImageFile.filename
    : null;

  const imagePaths = imageFiles.map((file) => `product/${file.filename}`);

  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
  });
  let slug = baseSlug;
  let slugExists = await mkProductModel.checkSlugExists(slug);
  let slugCounter = 1;

  // If slug exists, append a counter to it until a unique slug is found
  while (slugExists) {
    slug = `${baseSlug}-${slugCounter}`;
    slugExists = await mkProductModel.checkSlugExists(slug);
    slugCounter++;
  }

  try {
    const result = await mkProductModel.mkProductModel(
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
      imagePaths, // Pass image paths to the model
      featuredImage // Pass featured image path to the model
    );
    res.status(200).json({ message: "Product created successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// get all products controller
const getAllProductsController = async (req, res) => {
  try {
    const result = await mkProductModel.getAllProducts();
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};


const getAllProductsbyShopId = async (req, res) => {
  const shop_id = req.params.shop_id;
  try {
    const result = await mkProductModel.getAllProductsByShopId(shop_id);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getProductByIdController = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await mkProductModel.getProductById(productId);
    res.status(200).json({ result: product });
  } catch (error) {
    console.error("Error in getProductByIdController:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      shop_id,
      cat_id,
      sub_cat_id,
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
    } = req.body;
    const imageFiles = req.files.images || [];
    const featuredImageFile = req.files.featuredImage
      ? req.files.featuredImage[0]
      : null;
    const featuredImage = featuredImageFile
      ? "product/" + featuredImageFile.filename
      : null;

    const imagePaths = imageFiles.map((file) => `product/${file.filename}`);
    const baseSlug = slugify(name, {
      lower: true,
      strict: true,
    });
    let slug = baseSlug;
    let slugExists = await mkProductModel.checkSlugExists(slug);
    let slugCounter = 1;

    // If slug exists, append a counter to it until a unique slug is found
    while (slugExists) {
      slug = `${baseSlug}-${slugCounter}`;
      slugExists = await mkProductModel.checkSlugExists(slug);
      slugCounter++;
    }
    const result = await mkProductModel.updateProductById(
      id,
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
      imagePaths,
      featuredImage
    );

    console.log("result controller ", result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Failed to update product", error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await mkProductModel.deleteProductById(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Failed to delete product", error });
  }
};

const getAllFeaturedProductsController = async (req, res) => {
  try {
    const result = await mkProductModel.getAllFeaturedProducts();
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getProductImageController = async (req, res) => {
  const productId = req.params.id; // Assuming the product ID is passed as a route parameter
  console.log("check produt id", productId);

  try {
    const images = await mkProductModel.getProductImages(productId);
    res.status(200).json({ images });
  } catch (error) {
    res.status(404).json({ message: "Error retrieving product images", error });
  }
};

const deleteProductImageController = async (req, res) => {
  const id = req.params.id; // Assuming the product ID is passed as a route parameter
  console.log("check product delete id", id);

  try {
    const images = await mkProductModel.deleteProductImages(id);
    res.status(200).json({ images });
  } catch (error) {
    res.status(404).json({ message: "Error retrieving product images", error });
  }
};

const getProductBySlugController = async (req, res) => {
  const slug = req.params.slug;

  try {
    const product = await mkProductModel.getProductBySlug(slug);
    res.status(200).json({ result: product });
  } catch (error) {
    console.error("Error in getProductByIdController:", error);
    res.status(500).json({ message: error.message });
  }
};


const transporter = nodemailer.createTransport({
  host: 'wowpetspalace.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'sales@wowpetspalace.com',
    pass: 'fn9oGOZWSvhw'
  }
});

// Function to send email
const sendEmail = async (to, subject, htmlContent, textContent) => {
  console.log(`Attempting to send email to ${to} with subject: ${subject}`);
  try {
    const info = await transporter.sendMail({
      from: '"WowPetsPalace" <sales@wowpetspalace.com>',
      to: to,
      subject: subject,
      text: textContent,
      html: htmlContent,
    });
    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    console.log('Full info:', JSON.stringify(info, null, 2));
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Full error object:', JSON.stringify(error, null, 2));
  }
}
// Order prodcut controller
const createOrder = async (req, res,next) => {
  const {
    user_id,
    billingDetails,
    shippingDetails,
    id: product_id,
    shop_id,
    name,
    quantity: qty,
    price,
    shipping_cost,
    product_unit,
    //  paymentMethodType,
    //  currency,
    // amount
  } = req.body;

  // Destructure billing details
  const {
    firstName: billing_first_name,
    lastName: billing_last_name,
    company: billing_company,
    country: billing_country,
    address1: billing_address_1,
    address2: billing_address_2,
    city: billing_city,
    state: billing_state,
    zipCode: billing_postal_code,
    phone: billing_phone,
    email: billing_email,
  } = billingDetails;

  // Destructure shipping details
  const {
    firstName: shipping_first_name,
    lastName: shipping_last_name,
    company: shipping_company,
    country: shipping_country,
    address1: shipping_address_1,
    address2: shipping_address_2,
    city: shipping_city,
    state: shipping_state,
    zipCode: shipping_postal_code,
    phone: shipping_phone,
    email: shipping_email,
  } = shippingDetails;

  const shopdetails = await shopModel.getShopByIdModel(shop_id);

 
  // You may need to calculate or set these values based on your business logic
  const sub_total_amount = price * qty;
  const total_item_amount = sub_total_amount + shipping_cost;
  const total_item_count = qty;
  const balance_amount = 0; // Set this based on your requirements
  const contact_name = `${shipping_first_name} ${shipping_last_name}`;
  const contact_phone = shipping_phone;
  const payment_method = "default_method"; // Set this based on your requirements
  const added_user_id = user_id; // Assuming the user creating the order is the same as user_id
  const trans_status_id = 1; // Set this based on your requirements
  const { currency_symbol } = shopdetails[0];
  const { currency_short_form } = shopdetails[0]; // Set this based on your requirements
  const original_price = price; // Assuming original price is the same as price

  try {
    const result = await mkProductModel.createOrderModel(
      user_id,
      shop_id,
      sub_total_amount,
      shipping_cost,
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
    );
    const user = await authUserModel.getAllAppUsersById(user_id);

    // const order_id = result.insertId; // Assuming this is how you get the order ID

 
   

    const { email: user_email, firstName, lastName } = user[0];
    console.log(user_email, "user email check ================")

    // Get shop owner email
    const { email: shop_email } = shopdetails[0];
    console.log(shop_email, "shop email check ================")

    // Email to User
    await sendEmail(
      user_email,
      'Order Confirmation',
      `<p>Dear ${firstName} ${lastName},</p><p>Thank you for your order. Your order for ${qty}x ${name} has been placed successfully. The total amount is ${currency_symbol}${total_item_amount}.</p>`,
      `Dear ${firstName} ${lastName},\n\nThank you for your order. Your order for ${qty}x ${name} has been placed successfully. The total amount is ${currency_symbol}${total_item_amount}.`
    );

    // Email to Shop Owner
    await sendEmail(
      shop_email,
      'New Order Placed',
      `<p>A new order has been placed by ${firstName} ${lastName}.</p><p>Order Details:<br>Product: ${name}<br>Quantity: ${qty}<br>Total Amount: ${currency_symbol}${total_item_amount}</p>`,
      `A new order has been placed by ${firstName} ${lastName}.\n\nOrder Details:\nProduct: ${name}\nQuantity: ${qty}\nTotal Amount: ${currency_symbol}${total_item_amount}`
    );

  

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in createOrderController:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAllOrderController = async (req,res) => {
   try {
    const result = await mkProductModel.getAllOrdersModel();
    res.status(200).json({result})
   } catch (error) {
     res.status(404).json(error)

   }
}
const getAllOrderByIDController = async (req, res) => {
    const id = req.params.id;

    console.log(id, "id check ================")
    try {
        const result = await mkProductModel.getAllOrdersModelById(id);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// delete orders
const deleteOrderController = async(req,res)=>{
  const id = req.params.id;
  try {
    const result = await mkProductModel.deleteOrders(id);
    if (result) {
      res.status(200).json({ message: 'Order deleted successfully' });
    }
    else {
      res.status(404).json({ message: 'Order not found' });
    }
   } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getAllOrderStatus = async(req,res)=>{
  try {
    const result = await mkProductModel.getOrderStatus();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const updateOrderStatus = async(req,res)=>{
  const id = req.params.id;
  const { status } = req.body;
  try {
    const result = await mkProductModel.updateOrderStatus(id, status);
    if (result) {
      res.status(200).json({ message: 'Order status updated successfully' });
    }
    else {
      res.status(404).json({ message: 'Order not found' });
    }
   } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getTransactionRecordController = async(req,res)=>{
  try {
    const result = await mkProductModel.getTransactionRecord();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


// const createDiscountController = async (req, res) => {
//     const { shop_id, name, discount, isPublish, productId } = req.body;

   
   
//    const image = req.file ? "discount/" + req.file.filename : null;  // Corrected file path

//     try {
//         const result = await mkProductModel.createDiscount(shop_id, name, discount, isPublish, image, productId);
//         res.status(200).json({ message: "Discount created successfully", result });
//     } catch (error) {
//         res.status(404).json(error);
//     }
// };

const createDiscountController = async (req, res) => {
    const { shop_id, name, discount, isPublish } = req.body;
    const productId = JSON.parse(req.body.productId);  // Parse the JSON string back to an array
   
    const image = req.file ? "discount/" + req.file.filename : null;

    try {
        const result = await mkProductModel.createDiscount(shop_id, name, discount, isPublish, image, productId);
        res.status(200).json({ message: "Discount created successfully", result });
    } catch (error) {
        res.status(404).json(error);
    }
};



const getDiscountProductController = async (req,res) =>{
  const shop_id = req.params.shop_id;

  console.log(shop_id,"con")
  try {
    const result = await mkProductModel.getDiscountsProducts(shop_id);
    res.status(200).json({result});
  } catch (error) {
    res.status(404).json(error)

  }
}



module.exports = {
  mkProductController,
  getAllProductsController,
  getAllProductsbyShopId,
  getProductByIdController,
  updateProduct,
  deleteProduct,
  getAllFeaturedProductsController,
  getProductImageController,
  deleteProductImageController,
  getProductBySlugController,
  createOrder,
  getAllOrderController,
  getAllOrderByIDController,
  deleteOrderController,
  getAllOrderStatus,
  updateOrderStatus,
  getTransactionRecordController,
  createDiscountController,
  getDiscountProductController
};
