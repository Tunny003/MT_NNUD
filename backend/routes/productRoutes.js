const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFilters, 
} = require('../controllers/productController');

const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


router.get('/filters', getFilters);

 
router.route('/')
  .get(getProducts) 
  .post(protect, isAdmin, upload.single('image'), createProduct);


router.route('/:id')
  .get(getProductById)
  .put(protect, isAdmin, upload.single('image'), updateProduct)
  .delete(protect, isAdmin, deleteProduct);

module.exports = router;
