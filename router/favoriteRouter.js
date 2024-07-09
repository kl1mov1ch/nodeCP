const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
router.use(express.json());
const {checkAuth} = require("../middleware/checkAuth");

router.get('/favorite', checkAuth, favoriteController.getFavorites);

router.delete('/favorite/:favoriteItemID',checkAuth, favoriteController.deleteFavoriteItem);

module.exports = router;
