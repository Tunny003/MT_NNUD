const Order = require('../models/Order')


exports.createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' })
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  })

  const createdOrder = await order.save()
  res.status(201).json(createdOrder)
}

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}


exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt')
  res.json(orders)
}


exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email')
  res.json(orders)
}


exports.updateToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    const updated = await order.save()
    res.json(updated)
  } else {
    res.status(404).json({ message: 'Order not found' })
  }
}


exports.updateToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()
    const updated = await order.save()
    res.json(updated)
  } else {
    res.status(404).json({ message: 'Order not found' })
  }
}
