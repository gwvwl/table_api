const { ProductDB, AdditionDB, CategoryDB, StockDB } = require('../database/modelDB');
const { logger } = require('../utils/logger');

class ProductModel {
    static async createProduct(name, amount, price, description, img_path) {
        try {
            const [product] = await ProductDB.findOrCreate({
                where: { name, amount },
                defaults: { name, amount, price, description, img_path },
            });

            return product;
        } catch (error) {
            logger.error('Error creating product:', error);
            throw error;
        }
    }

    static async getProductById(id) {
        try {
            const product = await ProductDB.findByPk(id, {
                include: [
                    { model: AdditionDB },
                    {
                        model: CategoryDB,
                        through: { attributes: { exclude: ['createdAt', 'updatedAt'] } },
                    },
                    {
                        model: StockDB,
                        through: { attributes: { exclude: ['createdAt', 'updatedAt'] } },
                    },
                ],
            });
            return product;
        } catch (error) {
            logger.error('Error getting product by ID:', error);
            throw error;
        }
    }

    static async getProductByName(name) {
        try {
            const product = await ProductDB.findOne({
                where: { name },
                include: [
                    {
                        model: AdditionDB,
                        through: { attributes: { exclude: ['createdAt', 'updatedAt'] } },
                    },
                    {
                        model: CategoryDB,
                        through: { attributes: { exclude: ['createdAt', 'updatedAt'] } },
                    },
                    {
                        model: StockDB,
                        through: { attributes: { exclude: ['createdAt', 'updatedAt'] } },
                    },
                ],
            });
            return product;
        } catch (error) {
            logger.error('Error getting product by name:', error);
            throw error;
        }
    }
    static async getAllProducts() {
        try {
            const product = await ProductDB.findAll({
                include: [
                    {
                        model: AdditionDB,
                        through: { attributes: [] },
                    },
                    { model: StockDB, through: { attributes: [] } },
                    { model: CategoryDB, through: { attributes: [] } },
                ],
                order: [['createdAt', 'DESC']],
            });
            return product;
        } catch (error) {
            logger.error('Error getting all product:', error);
            throw error;
        }
    }

    static async addStockToProduct(productId, stockName) {
        try {
            const product = await ProductDB.findByPk(productId);

            if (!product) {
                throw new Error('Product not found');
            }

            const stock = await StockDB.findOne({
                where: { name: stockName },
            });
            if (stock) {
                const hasStock = await product.hasStocks(stock);
                if (!hasStock) {
                    await product.addStocks(stock);
                }
            }

            return product;
        } catch (error) {
            logger.error('Error updating stock for product:', error);
            throw error;
        }
    }
    static async removeStockFromProduct(productId, stockName) {
        try {
            const product = await ProductDB.findByPk(productId);

            if (!product) {
                throw new Error('Product not found');
            }

            const stock = await StockDB.findOne({
                where: { name: stockName },
            });

            if (!stock) {
                throw new Error('Stock not found');
            }

            const hasStock = await product.hasStocks(stock);

            if (hasStock) {
                await product.removeStocks(stock);
            } else {
                throw new Error('Stock not associated with the product');
            }

            return product;
        } catch (error) {
            logger.error('Error removing stock from product:', error);
            throw error;
        }
    }

    static async addAdditionToProduct(productId, additionName) {
        try {
            const product = await ProductDB.findByPk(productId);

            if (!product) {
                throw new Error('Product not found');
            }

            const addition = await AdditionDB.findOne({
                where: { name: additionName },
            });
            if (addition) {
                const hasCategory = await product.hasAdditions(addition);
                if (!hasCategory) {
                    await product.addAdditions(addition);
                }
            }

            return product;
        } catch (error) {
            logger.error('Error updating additions for product:', error);
            throw error;
        }
    }
    static async removeAdditionFromProduct(productId, additionName) {
        try {
            const product = await ProductDB.findByPk(productId);

            if (!product) {
                throw new Error('Product not found');
            }

            const addition = await AdditionDB.findOne({
                where: { name: additionName },
            });

            if (!addition) {
                throw new Error('Addition not found');
            }

            const hasAddition = await product.hasAdditions(addition);

            if (hasAddition) {
                await product.removeAdditions(addition);
            } else {
                throw new Error('Addition not associated with the product');
            }

            return product;
        } catch (error) {
            logger.error('Error removing addition from product:', error);
            throw error;
        }
    }

    static async addCategoryToProduct(productId, categoryName) {
        try {
            const product = await ProductDB.findByPk(productId);

            if (!product) {
                throw new Error('Product not found');
            }

            const category = await CategoryDB.findOne({
                where: { name: categoryName },
            });

            if (category) {
                const hasCategory = await product.hasCategories(category);
                if (!hasCategory) {
                    await product.addCategories(category);
                }
            }

            return product;
        } catch (error) {
            logger.error('Error updating category for product:', error);
            throw error;
        }
    }
    static async removeCategoryFromProduct(productId, categoryName) {
        try {
            const product = await ProductDB.findByPk(productId);

            if (!product) {
                throw new Error('Product not found');
            }

            const category = await CategoryDB.findOne({
                where: { name: categoryName },
            });

            if (!category) {
                throw new Error('Category not found');
            }

            const hasCategory = await product.hasCategories(category);

            if (hasCategory) {
                await product.removeCategories(category);
            } else {
                throw new Error('Category not associated with the product');
            }

            return product;
        } catch (error) {
            logger.error('Error removing category from product:', error);
            throw error;
        }
    }
}

module.exports = ProductModel;
