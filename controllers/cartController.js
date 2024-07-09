//cvdi tpfi bieu znwp

const {CartItem, Clothing, ClothingCategory, Payment} = require('../models/model');
const nodemailer = require('nodemailer');

async function sendEmail(email, subject, message) {
    try {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'kl1mov1ch.exe@gmail.com',
                pass: 'cvdi tpfi bieu znwp'
            }
        });

        let mailOptions = {
            from: 'kl1mov1ch.exe@gmail.com',
            to: email,
            subject: subject,
            text: message
        };

        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

exports.getCart = async (req, res) => {
    try {
        const userId = req.id;
        const cartItems = await CartItem.findAll({where: {UserUserId: userId}});
        const categories = await ClothingCategory.findAll();
        const clothingCart = await Clothing.findAll();

        res.render('user/cartPage', {userId, cartItems, categories, clothingCart});

    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getTotalAmount = async (req, res) => {
    try {
        const userId = req.id;
        const cartItems = await CartItem.findAll({where: {UserUserId: userId}});

        const promises = cartItems.map(async (item) => {
            const clothing = await Clothing.findByPk(item.ClothingClothingId);
            return item.quantity * clothing.price;
        });

        let prices = await Promise.all(promises);
        let totalAmount = prices.reduce((acc, price) => acc + price, 0);

        res.status(200).json({totalAmount});
    } catch (error) {
        console.error('Error fetching total amount:', error);
        res.status(500).json({error: 'Failed to fetch total amount'});
    }
};


exports.addToCart = async (req, res) => {
    try {
        const userId = req.id;
        const {itemId} = req.body;
        const clothing = await Clothing.findByPk(itemId);
        let cartItem = await CartItem.findOne({where: {UserUserId: userId, ClothingClothingId: itemId}});

        if (cartItem) {
            cartItem.quantity += 1;
            await cartItem.save();
        } else {
            await CartItem.create({
                quantity: 1,
                UserUserId: userId,
                ClothingClothingId: itemId,
                title: clothing.title,
                image_url: clothing.image_url
            });
        }

        res.status(200).send('Item added to cart successfully');
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.decreaseQuantity = async (req, res) => {
    try {
        const userId = req.id;
        const cartItems = await CartItem.findAll({where: {UserUserId: userId}});
        const cartItemID = req.params.cartItemId;
        const cartItem = await CartItem.findOne({where: {item_id: cartItemID}});

        if (!cartItem) {
            return res.status(404).json({message: 'Cart item not found'});
        }
        if (cartItem.quantity === 1)
            await cartItem.destroy();

        cartItem.quantity = Math.max(cartItem.quantity - 1, 0);
        await cartItem.save();

        res.status(200).json({quantity: cartItem.quantity});
    } catch (error) {
        console.error('Error decreasing quantity:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

exports.increaseQuantity = async (req, res) => {
    try {
        const userId = req.id;
        const cartItems = await CartItem.findAll({where: {UserUserId: userId}});
        const cartItemID = req.params.cartItemId;
        const cartItem = await CartItem.findOne({where: {item_id: cartItemID}});
        console.log(cartItem)

        if (!cartItem) {
            return res.status(404).json({message: 'Cart item not found'});
        }

        cartItem.quantity += 1;
        await cartItem.save();

        res.status(200).json({quantity: cartItem.quantity});
    } catch (error) {
        console.error('Error increasing quantity:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const userId = req.id;
        const cartItems = await CartItem.findAll({where: {UserUserId: userId}});
        const cartItemID = req.params.cartItemId;
        const cartItem = await CartItem.findOne({where: {item_id: cartItemID}});
        if (!cartItem) {
            return res.status(404).json({message: 'Cart item not found'});
        }
        await cartItem.destroy();
        res.status(200).json({message: 'Cart item deleted successfully'});
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

exports.purchaseAllItems = async (req, res) => {
    try {
        const userId = req.id;
        const cartItems = await CartItem.findAll({where: {UserUserId: userId}});

        let totalAmount = 0;
        let orderDetails = [];

        for (const cartItem of cartItems) {
            const clothing = await Clothing.findByPk(cartItem.ClothingClothingId);
            if (clothing) {
                totalAmount += clothing.price * cartItem.quantity;
                orderDetails.push({
                    itemName: clothing.title,
                    price: clothing.price,
                    quantity: cartItem.quantity
                });
            }
        }

        const subject = 'Order Confirmation';
        let message = `Dear Customer,\n\nYour order has been confirmed. Thank you for shopping with us!\n\nOrder details:\n`;
        orderDetails.forEach(item => {
            message += `Item: ${item.itemName}, Quantity: ${item.quantity}, Price: $${item.price}\n`;
        });

        await sendEmail(req.body.email, subject, message);

        await Payment.create({
            payment_date: new Date(),
            amount: totalAmount,
            UserUserId: userId,
            orderDetails: orderDetails
        });

        await CartItem.destroy({where: {UserUserId: userId}});

        res.status(200).send('All items purchased successfully');
    } catch (error) {
        console.error('Error purchasing items:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.purchaseItem = async (req, res) => {
    try {
        const userId = req.id;
        const {email, name, address, itemId} = req.body;
        console.log(itemId)
        const subject = 'Order Confirmation';
        const message = `Dear ${name},\n\nYour order has been confirmed. Thank you for shopping with us!\n\nOrder details:\nAddress: ${address}`;
        const cartItem = await CartItem.findOne({where: {item_id: itemId}});
        const clothing = await Clothing.findByPk(cartItem.ClothingClothingId)

        const totalAmount = clothing.price * cartItem.quantity;
        const order = {
            itemName: clothing.title,
            price: clothing.price,
            quantity: cartItem.quantity
        };

        await Payment.create({
            payment_date: new Date(),
            amount: totalAmount,
            UserUserId: userId,
            orderDetails: order,
            ClothingClothingId: cartItem.ClothingClothingId
        });

        await CartItem.destroy({where: {item_id: +itemId}});

        await sendEmail(email, subject, message);

        res.status(200).send('Order placed successfully');
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send('Internal Server Error');
    }
};
