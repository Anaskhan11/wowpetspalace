// utils.js
export const createCartItem = (product, quantity = 1) => ({
  id: product.id,
  name: product.name,
  price: product.original_price,
  quantity,
  images: product.images,
  featured_image: product.featured_image,
  totalPrice: product.original_price * quantity,
  shopId: product.shop_id,
  product_unit: product.product_unit,
  shipping_cost: product.shipping_cost,
});
