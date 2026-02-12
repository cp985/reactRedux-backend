const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getMyOrders, 
  getOrderById,
  getAllOrders, 
  updateOrderStatus,
  updateOrderToPaid,
  deleteOrder
} = require('../controller/orderController');
const { protect, admin } = require('../middleware/auth');

// Routes private (utente loggato)
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/pay', protect, updateOrderToPaid);

// Routes admin
router.get('/', protect, admin, getAllOrders);
router.patch('/:id/status', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;