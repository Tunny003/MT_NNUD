const Cart = require('../models/Cart')


exports.addToCart = async (req, res) => {
  const userId = req.user._id
  const { productId, quantity } = req.body

  let cart = await Cart.findOne({ user: userId })

  if (!cart) {
    cart = new Cart({ user: userId, items: [] })
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId)

  if (itemIndex >= 0) {
    
    cart.items[itemIndex].quantity += quantity
  } else {
    
    cart.items.push({ product: productId, quantity })
  }

  await cart.save()
  res.status(200).json(cart)
}


exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
  if (!cart) {
    return res.status(200).json({ items: [] })
  }
  res.status(200).json(cart)
}


exports.removeFromCart = async (req, res) => {
  const { productId } = req.params
  const cart = await Cart.findOne({ user: req.user._id })

  if (cart) {
    cart.items = cart.items.filter(item => item.product.toString() !== productId)
    await cart.save()
    return res.status(200).json(cart)
  } else {
    return res.status(404).json({ message: 'Cart not found' })
  }
}