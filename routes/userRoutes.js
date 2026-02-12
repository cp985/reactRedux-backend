const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser
} = require('../controller/userController');
const { protect, admin } = require('../middleware/auth');

// Routes pubbliche (senza autenticazione)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Routes private (richiedono autenticazione)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Routes admin (richiedono autenticazione + ruolo admin)
router.get('/', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;