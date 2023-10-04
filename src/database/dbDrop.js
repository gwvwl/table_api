const { logger } = require("../utils/logger");
const sequelize = require("../config/db.config.init");
const models = require("./modelDB");
const { DB_NAME } = require("../utils/secrets");

(async () => {
  try {
    await sequelize.query(`DROP DATABASE IF EXISTS ${DB_NAME}`);
    logger.info("All tables cleared!");
  } catch (error) {
    logger.error(error.message);
  } finally {
    sequelize.close();
    process.exit(0);
  }
})();
