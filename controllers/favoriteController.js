const { FavoriteItem, Clothing, ClothingCategory, CartItem} = require('../models/model');

exports.getFavorites = async (req, res) => {
    try {
        const userId = req.id;
        const FavoriteItems = await FavoriteItem.findAll({ where: { UserUserId: userId } });
        const categories = await ClothingCategory.findAll();
        res.render('user/favoritePage', { userId, FavoriteItems, categories });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.addToFavorite = async (req, res) => {
    try {
        const userId = req.id;
        const { itemId } = req.body;
        const clothing = await Clothing.findByPk(itemId);

            await FavoriteItem.create({
                UserUserId: userId,
                ClothingClothingId: itemId,
                title: clothing.title,
                image_url: clothing.image_url
            });

        res.status(200).send('Item added to favorite successfully');
    } catch (error) {
        console.error('Error adding item to favorite:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteFavoriteItem = async (req, res) => {
    try {
        const favoriteItemID = req.params.favoriteItemID;
        const favoriteItem = await FavoriteItem.findOne({where: { favorite_id: favoriteItemID}});
        if (!favoriteItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        await favoriteItem.destroy();
        res.status(200).json({ message: 'Cart item deleted successfully' });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};