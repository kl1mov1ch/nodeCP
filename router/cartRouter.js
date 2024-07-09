const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
router.use(express.json());
const {checkAuth} = require("../middleware/checkAuth");

router.get('/cart', checkAuth, cartController.getCart);
router.post('/cart/decrease/:cartItemId',checkAuth, cartController.decreaseQuantity);
router.post('/cart/increase/:cartItemId',checkAuth, cartController.increaseQuantity);
router.delete('/cart/:cartItemId',checkAuth, cartController.deleteCartItem);
router.post('/cart/purchase/all', checkAuth, cartController.purchaseAllItems)
router.get('/cart/totalAmount', checkAuth , cartController.getTotalAmount);
router.post('/cart/purchase/item', checkAuth, cartController.purchaseItem);

module.exports = router;
