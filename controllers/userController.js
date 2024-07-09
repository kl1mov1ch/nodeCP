const { User } = require('../models/model');
const { Clothing } = require('../models/model');
const { ClothingCategory } = require('../models/model');
const { Notification } = require('../models/model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {sequelize} = require('../db')


class UserController {
    async registration(req, res) {
        try {
            const {username, password} = req.body;
            const candidate = await User.findOne({where: {username}});

            if (candidate) {
                return res.status(400).json({message: 'Пользователь с таким именем уже существует'});
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({username, password: hashedPassword, role_: false});

            const token = jwt.sign({id: user.user_id, role: user.role_}, 'secret', {expiresIn: '24h'});
            res.cookie('token', token, {maxAge: 86400000, httpOnly: true});
            return res.redirect(`/user/homePage`);
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Ошибка при регистрации'});
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({where: {username}});

            if (!user) {
                return res.render('loginForm', { errorMessage: 'Пользователь не найден' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render('loginForm', { errorMessage: 'Неверный пароль, попробуйте снова' });
            }

            const token = jwt.sign({id: user.user_id, role: user.role_}, 'secret', {expiresIn: '24h'});
            res.cookie('token', token, {maxAge: 86400000, httpOnly: true});

            if (user.role_ === true) {
                return res.redirect('/admin/adminPanel');
            } else {
                return res.redirect(`/user/homePage`);
            }
        } catch (e) {
            console.error(e);
            res.status(400).json({message: 'Ошибка при входе'});
        }
    }

    async showMainUserForm(req, res) {
        try {
            const page = req.query.page || 1;
            const limit = 3;

            const offset = (page - 1) * limit;

            const clothingList = await Clothing.findAll({offset, limit});
            const categories = await ClothingCategory.findAll();
            const userId = req.id;
            const notifications = await Notification.findAll({where: {UserUserId: userId}});

            const totalCount = await Clothing.count();
            const totalPages = Math.ceil(totalCount / limit);

            res.render('user/homePage', {categories, clothingList, notifications, totalPages, currentPage: page});
        } catch (error) {
            console.error('Error while fetching clothing list:', error);
            res.status(500).send('Internal Server Error');
        }
    }


    getClothingDetails = async (req, res) => {
        try {
            const clothingId = req.params.id;
            const categories = await ClothingCategory.findAll();
            const clothing = await Clothing.findByPk(clothingId);
            if (!clothing) {
                return res.status(404).send('Clothing not found');
            }
            res.render('user/clothingPage', {clothing, categories});
        } catch (error) {
            console.error('Error fetching clothing details:', error);
            res.status(500).send('Internal Server Error');
        }
    };

    getCategoryPage = async (req, res) => {
        try {
            const categoryId = req.params.categoryId;
            const categoryClothings = await Clothing.findAll({where: {ClothingCategoryCategoryId: categoryId}});
            const categories = await ClothingCategory.findAll();
            res.render('user/categoryPage', {categoryId, categoryClothings, categories});
        } catch (error) {
            console.error('Error fetching category page:', error);
            res.status(500).send('Internal Server Error');
        }
    };


    logout = async (req, res) => {
        try {
            res.clearCookie('token');
            res.redirect('/auth/login');
        } catch (error) {
            console.error('Error fetching clothing details:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async deleteNotification(req, res) {
        try {
            const {notificationId} = req.params;
            await Notification.destroy({where: {notification_id: notificationId}});
            res.sendStatus(200);
        } catch (error) {
            console.error('Error deleting notification:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async getNotifications(req, res) {
        try {
            const userId = req.id; // Предполагается, что у вас есть middleware для аутентификации, который устанавливает req.id
            const notifications = await Notification.findAll({where: {UserUserId: userId}});
            res.json({notifications});
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
}


module.exports = new UserController();
