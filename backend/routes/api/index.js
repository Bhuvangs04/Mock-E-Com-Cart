// routes/api/index.js (Updated)

const express = require('express');
const router = express.Router();


const { adminAuth } = require('../../middleware/authMiddleware'); 
const productController = require('../../controllers/productController');
const cartController = require('../../controllers/cartController');
const dataController = require('../../controllers/dataController'); 

router.get('/products', productController.getProducts);


router.get('/cart', cartController.getCart);
router.post('/cart', cartController.addItemToCart);
router.delete('/cart/:id', cartController.removeItemFromCart);
router.post('/checkout', cartController.checkout);
router.put('/cart/:productId', cartController.updateItemFromCart)


router.post('/admin/products/import', adminAuth, dataController.importProducts);

module.exports = router;