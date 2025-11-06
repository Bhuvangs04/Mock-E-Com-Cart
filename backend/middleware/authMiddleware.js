// middleware/authMiddleware.js

exports.adminAuth = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    const secretKey = process.env.ADMIN_API_KEY;

    if (!apiKey || apiKey !== secretKey) {
        return res.status(403).json({ message: 'Access Denied: Invalid or missing API Key' });
    }
    next();
};