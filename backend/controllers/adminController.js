const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Không thể tải danh sách người dùng' });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy người dùng' });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = req.body.isAdmin;

      const updated = await user.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật người dùng' });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.isAdmin) {
        return res.status(400).json({ message: 'Không thể xoá tài khoản admin' });
      }
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'Đã xoá người dùng' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xoá người dùng' });
  }
};


exports.createUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const newUser = new User({
      name,
      email,
      password,
      isAdmin: isAdmin || false,
    });

    const createdUser = await newUser.save();
    res.status(201).json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo người dùng' });
  }
};


exports.getSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find();
    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalSales,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thống kê tổng quan' });
  }
};
