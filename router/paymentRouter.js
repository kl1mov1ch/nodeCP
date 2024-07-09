const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const {checkAuth} = require("../middleware/checkAuth");
const paymentController = require("../controllers/paymentController");

router.get('/payment', checkAuth, paymentController.getPayment);

module.exports = router;
