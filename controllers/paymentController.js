const {Payment, Clothing, User, ClothingCategory} = require('../models/model');

exports.getPayment = async (req, res) => {
    try {
        const userId = req.id;
        const categories = await ClothingCategory.findAll();
        const paymentItems = await Payment.findAll({ where: { UserUserId: userId } });
        res.render('user/paymentPage', { userId, paymentItems, categories });
    } catch (error) {
        console.error('Error getting payment:', error);
        res.status(500).send('Internal Server Error');
    }
};


