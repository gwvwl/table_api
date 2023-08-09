const { logger } = require('../utils/logger');
const sequelize = require('../config/db.config.init');
const models = require('./modelDB');

(async () => {
    try {
        // Применение изменений для каждой модели
        for (const modelName in models) {
            // Используйте alter() для изменения таблицы
            await models[modelName].sync({ alter: true });
        }
        logger.info('Table fields updated successfully!');
    } catch (error) {
        logger.error(error.message);
    } finally {
        sequelize.close();
        process.exit(0);
    }
})();
