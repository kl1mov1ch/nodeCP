const express = require('express');
const router = express.Router();
const mainAdminController = require('../controllers/mainAdminController');
const {checkAuth} = require("../middleware/checkAuth");
const {checkAdmin} = require("../middleware/checkAdmin");

router.get('/add-clothing', checkAuth, checkAdmin, mainAdminController.renderAddClothingForm);

router.get('/add-category', checkAuth, checkAdmin, mainAdminController.renderAddCategoryForm);

router.post('/add-category', checkAuth, checkAdmin, mainAdminController.addCategory);

router.post('/add-clothing', checkAuth, checkAdmin, mainAdminController.upload.single('image'), mainAdminController.addClothing);

router.get('/edit-clothing/:id', checkAuth, checkAdmin, mainAdminController.renderEditClothingForm);
router.post('/edit-clothing/:id', checkAuth, checkAdmin,mainAdminController.upload.single('image'), mainAdminController.updateClothing);

router.post('/delete-clothing/:id', checkAuth, checkAdmin, mainAdminController.deleteClothing);

router.get('/adminPanel', checkAuth, checkAdmin, mainAdminController.showMainAdminForm);

router.get('/statistic', checkAuth, checkAdmin, mainAdminController.showStatisticForm);

module.exports = router;
