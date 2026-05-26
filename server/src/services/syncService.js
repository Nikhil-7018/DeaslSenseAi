// services/syncService.js

import * as productModel from '../models/productModel.js';

/**
 * Normalize API data
 */
function normalizeApiData(apiData) {
  return {
    name: apiData.name,
    amazon: apiData.amazonPrice ?? null,
    flipkart: apiData.flipkartPrice ?? null,
    croma: apiData.cromaPrice ?? null
  };
}

/**
 * Sync product into DB
 */
export async function syncProduct(apiData) {
  const data = normalizeApiData(apiData);

  // 🔥 You must CREATE a function in model to insert product
  const product = await productModel.insertProduct({
    name: data.name,
    amazon: data.amazon,
    flipkart: data.flipkart,
    croma: data.croma
  });

  return product;
}