// controllers/cartController.js

const Cart = require('../models/Cart'); 
const Product = require('../models/Product'); 

const MOCK_USER_ID = 'vibe_mock_user_1';

const calculateCartTotal = (cart) => {
    return cart.items.reduce((acc, item) => acc + (item.price * item.qty), 0).toFixed(2);
};

// @route   GET /api/cart
// @desc    Get current user's cart
// @access  Private (Mocked)
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: MOCK_USER_ID });
        if (!cart) {
            cart = { userId: MOCK_USER_ID, items: [], total: 0 };
        }
        res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching cart' });
    }
};

// @route   POST /api/cart
// @desc    Add or update item quantity in cart
// @access  Private (Mocked)
exports.addItemToCart = async (req, res) => {
    const { productId, qty = 1 } = req.body;

    try {
        const product = await Product.findOne({ id: productId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId: MOCK_USER_ID });

        if (!cart) {
            cart = new Cart({ userId: MOCK_USER_ID, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId === productId);

        if (itemIndex > -1) {
  
            cart.items[itemIndex].qty += qty;
        } else {
 
            cart.items.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                qty
            });
        }

        cart.total = calculateCartTotal(cart);
        await cart.save();
        res.status(200).json(cart);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding item to cart' });
    }
};

// @route   DELETE /api/cart/:id
// @desc    Remove item (by productId) from cart
// @access  Private (Mocked)
exports.removeItemFromCart = async (req, res) => {
    const productId = parseInt(req.params.id);

    try {
        let cart = await Cart.findOne({ userId: MOCK_USER_ID });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const initialLength = cart.items.length;

        cart.items = cart.items.filter(item => item.productId !== productId);

        if (cart.items.length === initialLength) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.total = calculateCartTotal(cart);
        await cart.save();
        res.status(200).json(cart);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error removing item from cart' });
    }
};


// @route   Update /api/cart/:id
// @desc    update item (by productId) from cart
// @access  Private (Mocked)
exports.updateItemFromCart = async (req, res) => {
    const { productId } = req.params;
    const { qty } = req.body;

    try {
        const cart = await Cart.findOne({ userId: MOCK_USER_ID });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            (item) => String(item.productId) === String(productId)
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (qty > 0) {
            cart.items[itemIndex].qty = qty;
        } else {
            cart.items.splice(itemIndex, 1);
        }

        cart.total = cart.items.reduce(
            (sum, item) => sum + item.price * item.qty,
            0
        );

        await cart.save();

        return res.status(200).json({
            message: 'Cart updated successfully',
            items: cart.items,
            total: cart.total,
        });
    } catch (err) {
        console.error('Error updating item quantity:', err);
        return res
            .status(500)
            .json({ message: 'Error updating item in cart', error: err.message });
    }
};



// @route   POST /api/checkout
// @desc    Process checkout and clear cart (Mock)
// @access  Private (Mocked)
exports.checkout = async (req, res) => {
    const { name, email } = req.body;

    try {
        const cart = await Cart.findOne({ userId: MOCK_USER_ID });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty. Cannot checkout.' });
        }

        const receipt = {
            orderId: `ORDER-${Date.now()}`,
            customer: { name, email },
            items: cart.items,
            finalTotal: cart.total,
            timestamp: new Date().toISOString(),
            status: 'Processing (Mock Payment Success)'
        };


        cart.items = [];
        cart.total = 0;
        await cart.save();

        res.status(200).json(receipt);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Mock checkout failed' });
    }
};