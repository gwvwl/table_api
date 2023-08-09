const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config.init');
const { logger } = require('../utils/logger');

const UserDB = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    login: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: DataTypes.STRING,
    img_path: DataTypes.STRING,
});

const RoleDB = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
});

const PermissionDB = sequelize.define('Permission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
});

const OrderDB = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    status: DataTypes.STRING,
    payment: DataTypes.STRING,
    comment: DataTypes.STRING,
    updatedBy: DataTypes.INTEGER,
    serializedData: DataTypes.JSON,
    totalPrice: DataTypes.FLOAT,
});
// test
const ProductInOrderDB = sequelize.define('ProoductsOrder', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
});

const FavoritePositionDB = sequelize.define('FavoritePosition', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    price: DataTypes.FLOAT,
    payment: DataTypes.STRING,
});

const CategoryDB = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    img_path: DataTypes.STRING,
});

const ProductDB = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    amount: DataTypes.STRING,
    price: DataTypes.FLOAT,
    description: DataTypes.STRING,
    img_path: DataTypes.STRING,
});

const StockDB = sequelize.define('Stock', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    amount: DataTypes.STRING,
    price: DataTypes.FLOAT,
    quantity: DataTypes.STRING,
    img_path: DataTypes.STRING,
});

const AdditionDB = sequelize.define('Addition', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    img_path: DataTypes.STRING,
});

const TokenDB = sequelize.define('Token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    refreshToken: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
});
// Defining Relationships Between Models

UserDB.belongsToMany(RoleDB, {
    through: 'user_has_roles',
    foreignKey: 'user_id',
});
RoleDB.belongsToMany(UserDB, {
    through: 'user_has_roles',
    foreignKey: 'role_id',
});

UserDB.belongsToMany(PermissionDB, {
    through: 'user_has_permission',
    foreignKey: 'user_id',
});
PermissionDB.belongsToMany(UserDB, {
    through: 'user_has_permission',
    foreignKey: 'permission_id',
});

// stock rel
StockDB.belongsToMany(ProductDB, {
    through: 'product_has_stock',
    foreignKey: 'product_id',
});
ProductDB.belongsToMany(StockDB, {
    through: 'product_has_stock',
    foreignKey: 'stock_id',
});

StockDB.belongsToMany(AdditionDB, {
    through: 'addition_has_stock',
    foreignKey: 'product_id',
});
AdditionDB.belongsToMany(StockDB, {
    through: 'addition_has_stock',
    foreignKey: 'stock_id',
});
// Order rel
OrderDB.belongsTo(UserDB, { foreignKey: 'user_id' });
UserDB.hasMany(OrderDB, { foreignKey: 'user_id' });

// Связь между ProductDB и OrderDB через таблицу prooducts_in_order
OrderDB.belongsToMany(ProductDB, {
    through: ProductInOrderDB,
    foreignKey: 'order_id',
});
ProductDB.belongsToMany(OrderDB, {
    through: ProductInOrderDB,
    foreignKey: 'product_id',
});

// Связь между AdditionDB и ProductInOrderDB через таблицу additions_in_product_in_order
ProductInOrderDB.belongsToMany(AdditionDB, {
    through: 'additions_in_product_in_order',
    foreignKey: 'product_in_order_id',
});
AdditionDB.belongsToMany(ProductInOrderDB, {
    through: 'additions_in_product_in_order',
    foreignKey: 'addition_id',
});

UserDB.hasMany(FavoritePositionDB, { foreignKey: 'user_id' });
FavoritePositionDB.belongsTo(UserDB, { foreignKey: 'user_id' });

FavoritePositionDB.belongsToMany(ProductDB, {
    through: 'favorite_positions_products',
    foreignKey: 'favorite_position_id',
});
ProductDB.belongsToMany(FavoritePositionDB, {
    through: 'favorite_positions_products',
    foreignKey: 'product_id',
});

ProductDB.belongsToMany(AdditionDB, {
    through: 'product_additions',
    foreignKey: 'product_id',
});
AdditionDB.belongsToMany(ProductDB, {
    through: 'product_additions',
    foreignKey: 'addition_id',
});

ProductDB.belongsToMany(CategoryDB, {
    through: 'product_categories',
    foreignKey: 'product_id',
});
CategoryDB.belongsToMany(ProductDB, {
    through: 'product_categories',
    foreignKey: 'category_id',
});

// Синхронизация моделей с базой данных
sequelize
    .sync({ force: false }) // force: true удаляет и создает таблицы заново (осторожно при использовании в продакшн)
    .then(() => {
        logger.info('Tables created successfully');
    })
    .catch((error) => {
        logger.error(error.message);
    });

module.exports = {
    UserDB,
    RoleDB,
    PermissionDB,
    OrderDB,
    FavoritePositionDB,
    CategoryDB,
    ProductDB,
    AdditionDB,
    TokenDB,
    StockDB,
    ProductInOrderDB,
};
