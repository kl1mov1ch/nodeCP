const jwt = require('jsonwebtoken');

exports.checkAdmin = async (req, res, next) => {
    try {
        if (req.cookies.token) {
            const token = req.cookies.token;
            const decoded = jwt.verify(token, 'secret');
            req.id = decoded.id;
            req.role = decoded.role;
            if (req.role === true) next();
            else res.redirect('/user/homePage');
        } else {
            res.redirect('/auth/login');
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};