const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

router.route('/').get(getProducts).post(createProduct);
router
  .route('/:shortId')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
