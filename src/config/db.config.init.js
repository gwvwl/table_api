const { Sequelize } = require("sequelize");
const { logger } = require("../utils/logger");
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = require("../utils/secrets");

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    logger.info("Connection has been established successfully.");
  })
  .catch((err) => {
    logger.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
