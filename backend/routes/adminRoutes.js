const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, isAdmin } = require('../middleware/authMiddleware');


const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  getSummary, 
} = require('../controllers/adminController');

const { deleteProduct } = require('../controllers/productController');


router.get('/users', protect, isAdmin, getAllUsers);
router.post('/users', protect, isAdmin, createUser);
router.get('/users/:id', protect, isAdmin, getUserById);
router.put('/users/:id', protect, isAdmin, updateUser);
router.delete('/users/:id', protect, isAdmin, deleteUser);


router.get('/orders', protect, isAdmin, async (req, res) => {
  const orders = await Order.find().populate('user', 'name email');
  res.json(orders);
});


router.get('/products', protect, isAdmin, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.delete('/products/:id', protect, isAdmin, deleteProduct);


router.get('/summary', protect, isAdmin, getSummary);

module.exports = router;
