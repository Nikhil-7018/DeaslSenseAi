// models/productModel.js

import mongoose from "mongoose";

/**
 * Price history schema
 */
const priceHistorySchema = new mongoose.Schema({
  amazon: Number,
  flipkart: Number,
  croma: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

/**
 * Product schema
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  priceHistory: [priceHistorySchema]
});

/**
 * Create model
 */
const Product = mongoose.model("Product", productSchema);

/**
 * 🔍 Search product
 */
export async function searchProducts(query) {
  return await Product.find({
    name: { $regex: query, $options: "i" }
  });
}

/**
 * ➕ Insert product (used in syncService)
 */
export async function insertProduct(data) {
  let product = await Product.findOne({ name: data.name });

  if (!product) {
    product = new Product({
      name: data.name,
      priceHistory: []
    });
  }

  product.priceHistory.push({
    amazon: data.amazon,
    flipkart: data.flipkart,
    croma: data.croma
  });

  await product.save();

  return product;
}

/**
 * (Optional) export model if needed
 */
export default Product;