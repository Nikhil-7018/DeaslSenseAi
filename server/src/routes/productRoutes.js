// import { Router } from 'express';
// import * as productController from '../controllers/productController.js';

// const router = Router();

// router.get('/search', productController.searchProducts);

// export default router;
import { Router } from 'express';
import * as productController from '../controllers/productController.js';

const router = Router();

// 🔍 Search product (DB + API fallback + chart + prediction)
router.get('/search', productController.searchProducts);

export default router;