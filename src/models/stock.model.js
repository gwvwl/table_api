const { StockDB } = require('../database/modelDB');
const { logger } = require('../utils/logger');
class StockModel {
    static async createStock(name, amount, price, quantity, img_path) {
        try {
            const [stock] = await StockDB.findOrCreate({
                where: { name },
                defaults: { name, amount, price, quantity, img_path },
            });

            return stock;
        } catch (error) {
            logger.error('Error creating stock:', error);
            throw error;
        }
    }

    static async getStockByName(name) {
        try {
            const stock = await StockDB.findOne({
                where: { name },
            });
            return stock;
        } catch (error) {
            logger.error('Error getting stock by name:', error);
            throw error;
        }
    }

    static async getStockById(id) {
        try {
            const stock = await StockDB.findOne({
                where: { id },
            });
            return stock;
        } catch (error) {
            logger.error('Error getting stock by id:', error);
            throw error;
        }
    }

    static async getAllStocks() {
        try {
            const stocks = await StockDB.findAll({ order: [['createdAt', 'DESC']] });
            return stocks;
        } catch (error) {
            logger.error('Error getting all stocks:', error);
            throw error;
        }
    }
}

module.exports = StockModel;
