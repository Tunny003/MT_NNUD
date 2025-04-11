const express = require('express')
const router = express.Router()
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateToPaid,
  updateToDelivered,
  getOrderById, 
} = require('../controllers/orderController')

const { protect } = require('../middleware/authMiddleware')


router.post('/', protect, createOrder)
router.get('/mine', protect, getMyOrders)
router.get('/', protect, getAllOrders) 
router.get('/:id', protect, getOrderById) 
router.put('/:id/pay', protect, updateToPaid)
router.put('/:id/deliver', protect, updateToDelivered)

module.exports = router
