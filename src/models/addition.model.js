const { AdditionDB, StockDB } = require('../database/modelDB');
const { logger } = require('../utils/logger');
class AdditionModel {
    static async createAddition(name, price, img_path) {
        try {
            const [addition] = await AdditionDB.findOrCreate({
                where: { name },
                defaults: { name, price, img_path },
            });

            return addition;
        } catch (error) {
            logger.error('Error creating addition:', error);
            throw error;
        }
    }

    static async getAdditionByName(name) {
        try {
            const addition = await AdditionDB.findOne({
                where: { name },
                include: [{ model: StockDB, through: { attributes: [] } }],
            });
            return addition;
        } catch (error) {
            logger.error('Error getting addition by name:', error);
            throw error;
        }
    }
    static async getAdditionById(id) {
        try {
            const addition = await AdditionDB.findOne({
                where: { id },
                include: [{ model: StockDB, through: { attributes: [] } }],
            });
            return addition;
        } catch (error) {
            logger.error('Error getting addition by id:', error);
            throw error;
        }
    }
    static async addStockToAddition(productId, stockName) {
        try {
            const addition = await AdditionDB.findByPk(productId);

            if (!addition) {
                throw new Error('addition not found');
            }

            const stock = await StockDB.findOne({
                where: { name: stockName },
            });
            if (stock) {
                const hasStock = await addition.hasStocks(stock);
                if (!hasStock) {
                    await addition.addStocks(stock);
                }
            }

            return addition;
        } catch (error) {
            logger.error('Error updating stock for addition:', error);
            throw error;
        }
    }

    static async removeStockFromAddition(additionId, stockName) {
        try {
            const addition = await AdditionDB.findByPk(additionId);

            if (!addition) {
                throw new Error('addition not found');
            }

            const stock = await StockDB.findOne({
                where: { name: stockName },
            });

            if (!stock) {
                throw new Error('Stock not found');
            }

            const hasStock = await addition.hasStocks(stock);

            if (hasStock) {
                await addition.removeStocks(stock);
            } else {
                throw new Error('Stock not associated with the addition');
            }

            return addition;
        } catch (error) {
            logger.error('Error removing stock from addition:', error);
            throw error;
        }
    }
    static async getAllAdditions() {
        try {
            const additions = await AdditionDB.findAll({
                order: [['createdAt', 'DESC']],
                include: [{ model: StockDB, through: { attributes: [] } }],
                // include: { model: ProductDB, through: { attributes: [] } },
            });
            return additions;
        } catch (error) {
            logger.error('Error getting all additions:', error);
            throw error;
        }
    }
}

module.exports = AdditionModel;
