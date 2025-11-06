// models/Cart.js
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1, default: 1 }
}, { _id: false }); 

const CartSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    items: [CartItemSchema],
    total: { type: Number, default: 0 }
});

module.exports = mongoose.model('Cart', CartSchema);