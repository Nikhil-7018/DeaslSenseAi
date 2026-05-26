// import * as productModel from '../models/productModel.js';
// import { asyncHandler } from '../utils/asyncHandler.js';

// export const searchProducts = asyncHandler(async (req, res) => {
//   const q = req.query.q;
//   const products = await productModel.searchProducts(typeof q === 'string' ? q : '');
//   res.json({ success: true, query: q || '', count: products.length, products });
// });
import * as productModel from '../models/productModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';

import { fetchProduct } from '../services/serpApiService.js';
import { syncProduct } from '../services/syncService.js';
import { linearRegression } from '../services/predictionService.js';

import {
  generatePriceChart,
  getPriceDifference,
  canGenerateChart
} from '../services/priceChartService.js';

export const searchProducts = asyncHandler(async (req, res) => {
  const q = req.query.q || '';

  if (!q || typeof q !== 'string') {
    return res.status(400).json({
      success: false,
      message: "Missing or invalid query"
    });
  }

  // 🔹 STEP 1: Search in DB
  let products = await productModel.searchProducts(q);

  let product;

  if (products.length > 0) {
    product = products[0]; // take first match
  } else {
    // 🔹 STEP 2: Fetch from SerpAPI
    const apiData = await fetchProduct(q);

    if (!apiData) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // 🔹 STEP 3: Sync into DB (IMPORTANT)
    product = await syncProduct(apiData);
  }

  // 🔹 STEP 4: Generate Chart
  const chart = canGenerateChart(product.priceHistory)
    ? generatePriceChart(product.priceHistory)
    : null;

  // 🔹 STEP 5: Prediction (Linear Regression)
  const prediction = linearRegression(product.priceHistory);

  // 🔹 STEP 6: Price Difference
  const diff = getPriceDifference(product.priceHistory);

  res.json({
    success: true,
    query: q,
    product,
    prediction,
    chart,
    diff
  });
});