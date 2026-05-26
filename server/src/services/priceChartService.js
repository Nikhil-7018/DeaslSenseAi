// services/priceChartService.js

/**
 * Generate chart data for frontend (best for Recharts / Chart.js)
 */
function generatePriceChart(history) {
  if (!history || history.length === 0) {
    return {
      success: false,
      message: "No price history available",
      data: []
    };
  }

  const chartData = history.map((entry, index) => ({
    index: index + 1,

    date: entry.date
      ? new Date(entry.date).toLocaleDateString()
      : `Day ${index + 1}`,

    amazon: entry.amazon ?? null,
    flipkart: entry.flipkart ?? null,
    croma: entry.croma ?? null,

    average: calculateAverage(entry)
  }));

  return {
    success: true,
    data: chartData
  };
}


/**
 * Convert history into pivot format (for charts)
 */
function pivotPriceHistory(history) {
  if (!history || history.length === 0) return null;

  return {
    amazon: history.map(h => h.amazon ?? null),
    flipkart: history.map(h => h.flipkart ?? null),
    croma: history.map(h => h.croma ?? null),

    dates: history.map((h, i) =>
      h.date
        ? new Date(h.date).toLocaleDateString()
        : `Day ${i + 1}`
    )
  };
}


/**
 * Calculate average price
 */
function calculateAverage(entry) {
  const prices = [entry.amazon, entry.flipkart, entry.croma]
    .filter(p => p !== null && p !== undefined);

  if (prices.length === 0) return null;

  const sum = prices.reduce((a, b) => a + b, 0);
  return Number((sum / prices.length).toFixed(2));
}


/**
 * Get price difference between stores
 */
function getPriceDifference(history) {
  if (!history || history.length === 0) return null;

  const latest = history[history.length - 1];

  return {
    amazon_flipkart: safeDiff(latest.amazon, latest.flipkart),
    amazon_croma: safeDiff(latest.amazon, latest.croma),
    flipkart_croma: safeDiff(latest.flipkart, latest.croma)
  };
}


/**
 * Safe difference calculation
 */
function safeDiff(a, b) {
  if (a == null || b == null) return null;
  return Number((a - b).toFixed(2));
}


/**
 * Get latest prices
 */
function getLatestPrices(history) {
  if (!history || history.length === 0) return null;

  const latest = history[history.length - 1];

  return {
    amazon: latest.amazon ?? null,
    flipkart: latest.flipkart ?? null,
    croma: latest.croma ?? null
  };
}


/**
 * Check if chart can be generated
 */
function canGenerateChart(history) {
  if (!history || history.length < 2) return false;

  let validPoints = 0;

  history.forEach(h => {
    if (h.amazon != null || h.flipkart != null || h.croma != null) {
      validPoints++;
    }
  });

  return validPoints >= 2;
}


/**
 * ✅ EXPORT ALL FUNCTIONS (VERY IMPORTANT)
 */
export {
  generatePriceChart,
  pivotPriceHistory,
  getPriceDifference,
  getLatestPrices,
  canGenerateChart
};