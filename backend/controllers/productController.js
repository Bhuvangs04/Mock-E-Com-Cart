// controllers/productController.js

const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({}, { _id: 0, __v: 0 });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching products' });
    }
};