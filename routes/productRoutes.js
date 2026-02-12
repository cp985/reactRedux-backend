const express = require('express');
const router = express.Router();
const { 
  getAllProducts, 
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} = require('../controller/productController');
const { protect, admin } = require('../middleware/auth');

// Routes pubbliche
router.get('/', getAllProducts);
router.get('/category/:categoria', getProductsByCategory);
router.get('/:id', getProductById);

// Routes admin
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;