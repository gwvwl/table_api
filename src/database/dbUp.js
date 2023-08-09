const { logger } = require('../utils/logger');
const sequelize = require('../config/db.config.init');

(async () => {
    try {
        await sequelize.sync();
        logger.info('DB created!');
    } catch (error) {
        logger.error(error.message);
    } finally {
        sequelize.close();
        process.exit(0);
    }
})();
