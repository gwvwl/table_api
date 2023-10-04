const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.init");
const { logger } = require("../utils/logger");

const UserDB = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  login: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: DataTypes.STRING,
});

const OrderDB = sequelize.define("Addition", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: DataTypes.STRING,
  name: DataTypes.STRING,
  phone: DataTypes.STRING,
  date: DataTypes.DATE,
  customs: DataTypes.INTEGER,
  details: DataTypes.STRING,
});

// Синхронизация моделей с базой данных
sequelize
  .sync({ force: false })
  .then(() => {
    logger.info("Tables created successfully");
  })
  .catch((error) => {
    logger.error(error.message);
  });

module.exports = {
  UserDB,
  OrderDB,
};
