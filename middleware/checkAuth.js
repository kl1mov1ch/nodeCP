const jwt = require('jsonwebtoken');

exports.checkAuth = async (req, res, next) => {
    try {
        if (req.cookies.token) {
            const token = req.cookies.token;
            const decoded = jwt.verify(token, 'secret');
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        } else {
            res.redirect('/auth/login');
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};