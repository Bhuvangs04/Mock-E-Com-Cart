// controllers/dataController.js

const Product = require('../models/Product'); 

// @route   POST /api/admin/products/import
// @desc    Securely import an array of products into the database
// @access  Private (API Key Protected)
exports.importProducts = async (req, res) => {
    const productsToImport = req.body;

    if (!Array.isArray(productsToImport) || productsToImport.length === 0) {
        return res.status(400).json({ message: 'Invalid payload. Expecting a non-empty array of products.' });
    }

    try {

        const bulkOps = productsToImport.map(product => ({
            updateOne: {
                filter: { id: product.id },
                update: { $set: product },
                upsert: true
            }
        }));

        const result = await Product.bulkWrite(bulkOps);

        res.status(200).json({
            message: 'Products imported/updated successfully.',
            insertedCount: result.upsertedCount + result.insertedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (err) {
        console.error('Error importing products:', err);
        res.status(500).json({ message: 'An error occurred during product import.', error: err.message });
    }
};