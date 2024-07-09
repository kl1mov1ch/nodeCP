const { Clothing, Payment} = require('../models/model');
const { ClothingCategory } = require('../models/model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const socketIo = require('socket.io');


exports.sendMessage = async (req, res) => {
    try {
        const { message } = req.body;

        io.emit('message', message);

        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
};


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '');
        fs.mkdir(uploadDir, { recursive: true }, function(err) {
            if (err) {
                console.error("Error creating directory:", err);
            }
            cb(null, uploadDir);
        });
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        cb(null, Date.now() + extension);
    }
});

exports.upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'image/jpeg' || 'image/png' || 'img/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG images are allowed'));
        }
    }
});

exports.getCategories = async (req, res) => {
    try {
        const categories = await ClothingCategory.findAll();
        res.render('addClothingForm', { categories: categories });
    } catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).json({ message: 'Failed to get categories' });
    }
};

exports.renderAddClothingForm = async (req, res) => {
    try {
        const categories = await ClothingCategory.findAll();

        res.render('addClothingForm', { categories });
    } catch (error) {
        console.error('Error rendering add clothing form:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.renderAddCategoryForm = (req, res) => {
    res.render('addCategoryForm');
};

exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const existingCategory = await ClothingCategory.findOne({ where: { category_name: name } });

        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const newCategory = await ClothingCategory.create({
            category_name: name
        });

        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Failed to add category' });
    }
};


exports.showMainAdminForm = async (req, res) => {
    try {
        const clothingList = await Clothing.findAll();
        res.render('mainAdminForm', { clothingList });
    } catch (error) {
        console.error('Error while fetching clothing list:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.addClothing = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.file);

        const { title, description, price, category_id } = req.body;
        if (!req.file || !req.file.path) {
            throw new Error('No image uploaded');
        }

        const filename = Date.now() + path.extname(req.file.originalname);
        const destination = path.join(__dirname, '..', 'uploads', 'static', filename);

        fs.renameSync(req.file.path, destination);

        const newClothing = await Clothing.create({
            title,
            description,
            price,
            image_url: filename,
            ClothingCategoryCategoryId: category_id
        });
        res.redirect('/admin/adminPanel');
    } catch (error) {
        console.error('Error adding new clothing:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.updateClothing = async (req, res) => {
    try {
        const clothingId = req.params.id;
        const { title, description, price, category_id } = req.body;

        const clothing = await Clothing.findByPk(clothingId);

        if (!clothing) {
            return res.status(404).json({ error: 'Clothing not found' });
        }
        if (!req.file || !req.file.path) {
            throw new Error('No image uploaded');
        }
        const filename = Date.now() + path.extname(req.file.originalname);
        const destination = path.join(__dirname, '..', 'uploads', 'static', filename);

        fs.renameSync(req.file.path, destination);

        clothing.title = title;
        clothing.description = description;
        clothing.price = price;
        clothing.image_url = filename;
        clothing.ClothingCategoryId = category_id;
        res.redirect('/admin/adminPanel');
        await clothing.save();

    } catch (error) {
        console.error('Error updating clothing:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteClothing = async (req, res) => {
    try {
        const clothingId = req.params.id;

        await Clothing.destroy({ where: { clothing_id: clothingId } });
        res.redirect('/admin/adminPanel');
    } catch (error) {
        console.error('Error deleting clothing:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.renderEditClothingForm = async (req, res) => {
    try {
        const clothingId = req.params.id;
        const clothing = await Clothing.findByPk(clothingId);
        const categories = await ClothingCategory.findAll();

        if (!clothing) {
            return res.status(404).send('Clothing not found');
        }

        res.render('editClothingForm', { clothing, categories });
    } catch (error) {
        console.error('Error rendering edit clothing form:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.showStatisticForm = async (req, res) => {
    try {
        const userId = req.id;
        const paymentItems = await Payment.findAll();
        res.render('statisticPage', { userId, paymentItems });
    } catch (error) {
        console.error('Error getting payment:', error);
        res.status(500).send('Internal Server Error');
    }
}


