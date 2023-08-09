const { CategoryDB, ProductDB, AdditionDB, StockDB } = require('../database/modelDB');
const { logger } = require('../utils/logger');
class CategoryModel {
    static async createCategory(name, img_path) {
        try {
            const [category] = await CategoryDB.findOrCreate({
                where: { name },
                defaults: { name, img_path },
            });

            return category;
        } catch (error) {
            logger.error('Error creating category:', error);
            throw error;
        }
    }

    static async getCategoryById(id) {
        try {
            const category = await CategoryDB.findByPk(id);
            return category;
        } catch (error) {
            logger.error('Error getting category by ID:', error);
            throw error;
        }
    }

    static async updateCategory(categoryId, name, img_path) {
        try {
            const category = await CategoryDB.findByPk(categoryId);
            if (!category) {
                return null;
            }
            category.name = name || category.name;
            category.img_path = img_path || category.img_path;
            await category.save();
            return category;
        } catch (error) {
            logger.error('Error updating category:', error);
            throw error;
        }
    }
    static async getAllCategories() {
        try {
            const categories = await CategoryDB.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [
                    {
                        model: ProductDB,
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                        through: { attributes: [] },
                        include: [
                            {
                                model: AdditionDB,
                                through: { attributes: [] },
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt'],
                                },
                            },
                            {
                                model: StockDB,
                                through: {
                                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                                },
                            },
                            {
                                model: CategoryDB,
                                through: {
                                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                                },
                            },
                        ],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            return categories;
        } catch (error) {
            logger.error('Error getting all categories:', error);
            throw error;
        }
    }
    static async deleteCategory(categoryId) {
        try {
            const category = await CategoryDB.findByPk(categoryId);
            if (!category) {
                return null;
            }
            await category.destroy();
            return category;
        } catch (error) {
            logger.error('Error deleting category:', error);
            throw error;
        }
    }
}

module.exports = CategoryModel;
