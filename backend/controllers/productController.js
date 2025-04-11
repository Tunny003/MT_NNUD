const Product = require('../models/Product');


exports.createProduct = async (req, res) => {
  const { name, brand, category, description, price, countInStock } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const product = new Product({
      name,
      brand,
      category,
      description,
      price,
      countInStock,
      image,
    });

    const created = await product.save();
    res.status(201).json(created);
  } catch (error) {
    console.error('❌ Lỗi tạo sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo sản phẩm' });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const pageSize = 6;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    const brand = req.query.brand
      ? { brand: { $regex: req.query.brand, $options: 'i' } }
      : {};

    const category = req.query.category
      ? { category: { $regex: req.query.category, $options: 'i' } }
      : {};

    const filter = { ...keyword, ...brand, ...category };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm' });
  }
};


exports.getFilters = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    const categories = await Product.distinct('category');
    res.json({ brands, categories });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy filters' });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  } catch (error) {
    console.error('❌ Lỗi lấy sản phẩm theo ID:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm' });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = req.body.name || product.name;
      product.brand = req.body.brand || product.brand;
      product.category = req.body.category || product.category;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.countInStock = req.body.countInStock || product.countInStock;

      if (req.file) {
        product.image = `/uploads/${req.file.filename}`;
      }

      const updated = await product.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  } catch (error) {
    console.error('❌ Lỗi cập nhật sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật sản phẩm' });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Đã xoá sản phẩm' });
  } catch (error) {
    console.error('❌ Lỗi xoá sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server khi xoá sản phẩm' });
  }
};
