const express = require('express');
const session = require('express-session');
const userController = require("../controllers/userController");
const {checkAuth} = require("../middleware/checkAuth");
const router = express.Router();

router.use(session({
    secret: '123123123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

router.get('/login', (req, res) => {
    res.render('loginForm');
});

router.get('/registration', (req, res) => {
    res.render('registrationForm');
});

router.get('/logout', checkAuth, userController.logout)

router.post('/registration', userController.registration);

router.post('/login', userController.login);


module.exports = router;
