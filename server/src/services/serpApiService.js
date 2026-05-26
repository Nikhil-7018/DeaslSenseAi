import axios from "axios";

export const fetchProduct = async (query) => {
  const res = await axios.get("https://serpapi.com/search", {
    params: {
      q: query,
      api_key: process.env.SERPAPI_KEY
    }
  });

  const data = res.data;

  return {
    name: query,
    amazonPrice: extractPrice(data, "amazon"),
    flipkartPrice: extractPrice(data, "flipkart"),
    cromaPrice: extractPrice(data, "croma")
  };
};

function extractPrice(data, store) {
  const item = data?.shopping_results?.find(p =>
    p.source?.toLowerCase().includes(store)
  );

  if (!item) return null;

  return parseFloat(item.price.replace(/[^\d.]/g, ""));
}