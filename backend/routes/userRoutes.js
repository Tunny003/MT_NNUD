const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/userController');

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/adminController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// Auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// Admin
router.get('/', protect, isAdmin, getAllUsers);
router.get('/:id', protect, isAdmin, getUserById);
router.put('/:id', protect, isAdmin, updateUser);
router.delete('/:id', protect, isAdmin, deleteUser);

module.exports = router;
