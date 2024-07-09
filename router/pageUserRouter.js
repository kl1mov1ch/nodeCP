const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const cartController = require("../controllers/cartController")
const {checkAuth} = require("../middleware/checkAuth");
const favoriteController = require("../controllers/favoriteController");

router.get('/homePage', checkAuth, userController.showMainUserForm);

router.get('/clothing/:id', checkAuth, userController.getClothingDetails);

router.post('/cart/add', checkAuth, cartController.addToCart);

router.post('/favorite/add', checkAuth, favoriteController.addToFavorite);

router.get('/category/:categoryId',checkAuth, userController.getCategoryPage);

router.get('/notifications',checkAuth ,userController.getNotifications);

router.delete('/notification/delete/:notificationId',checkAuth, userController.deleteNotification);




module.exports = router;
