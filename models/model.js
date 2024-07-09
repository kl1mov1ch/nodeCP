const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('NodeCP', 'postgres', 'Kanton731', {
    host: 'localhost',
    dialect: 'postgres'
});

const User = sequelize.define('User', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(255), allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role_: { type: DataTypes.BOOLEAN, allowNull: false }
});

const ClothingCategory = sequelize.define('ClothingCategory', {
    category_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    category_name: { type: DataTypes.STRING(50), allowNull: false }
});

const Clothing = sequelize.define('Clothing', {
    clothing_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.STRING(500), allowNull: false },
    price: { type: DataTypes.NUMERIC(10, 2), allowNull: false },
    image_url: { type: DataTypes.STRING(500), allowNull: true } // Ссылка на изображение товара
});

const CartItem = sequelize.define('CartItem', {
    item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    image_url: { type: DataTypes.STRING(500), allowNull: true },
    title: { type: DataTypes.STRING(100), allowNull: false }
});

const FavoriteItem = sequelize.define('FavoriteItem', {
    favorite_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    image_url: { type: DataTypes.STRING(500), allowNull: true },
    title: { type: DataTypes.STRING(100), allowNull: false }
});

const Notification = sequelize.define('Notification', {
    notification_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    message: { type: DataTypes.STRING(255), allowNull: false },
    status: {type: DataTypes.BOOLEAN, allowNull: false}
})


const Payment = sequelize.define('Payment', {
    payment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    payment_date: { type: DataTypes.DATE, allowNull: false },
    amount: { type: DataTypes.NUMERIC(10, 2), allowNull: false },
});

Payment.belongsTo(User);
Payment.belongsTo(Clothing);

const SalesStatistic = sequelize.define('SalesStatistic', {
    statistic_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity_sold: { type: DataTypes.INTEGER, allowNull: false },
    sales_date: { type: DataTypes.DATE, allowNull: false },
    total_revenue: { type: DataTypes.NUMERIC(10, 2), allowNull: false },
    image_url: { type: DataTypes.STRING(500), allowNull: true } // Ссылка на изображение товара в статистике
});

User.hasMany(CartItem);
CartItem.belongsTo(User);

User.hasMany(Notification);
Notification.belongsTo(User);

ClothingCategory.hasMany(Clothing);
Clothing.belongsTo(ClothingCategory);

Clothing.hasMany(CartItem);
CartItem.belongsTo(Clothing);

User.belongsToMany(Clothing, { through: FavoriteItem });
Clothing.belongsToMany(User, { through: FavoriteItem });

Clothing.hasMany(SalesStatistic);
SalesStatistic.belongsTo(Clothing);

sequelize.sync()
    .then(() => {
        console.log('Database synchronized successfully.');
    })
    .catch(err => {
        console.error('An error occurred while synchronizing the database:', err);
    });

module.exports = {
    User,
    ClothingCategory,
    Clothing,
    CartItem,
    FavoriteItem,
    Payment,
    SalesStatistic,
    Notification
};
