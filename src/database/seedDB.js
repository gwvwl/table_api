const { faker } = require('@faker-js/faker');
const _ = require('lodash');
const { logger } = require('../utils/logger');
const CategoryModel = require('../models/category.model');
const ProductModel = require('../models/product.model');
const AdditionModel = require('../models/addition.model');
const StockModel = require('../models/stock.model');
const orderModel = require('../models/order.model');
// const data = [
//     { product_id: 1508, addition_ids: [537, 545], count: 3 },
//     { product_id: 1515, addition_ids: [545, 537], count: 1 },
// ];
// orderModel.createOrderWithProductsAndAdditions({ data });
async function createTestData() {
    try {
        // Создание категорий
        const category = [];
        for (let i = 0; i < 10; i++) {
            const name = faker.commerce.department();
            category.push(name);
        }
        category.forEach(async (i) => {
            await CategoryModel.createCategory(i);
        });
        // Создание stock
        const stock = [];
        for (let i = 0; i < 50; i++) {
            const name = faker.commerce.productName();

            stock.push(name);
        }
        stock.forEach(async (name) => {
            const price = faker.commerce.price();
            const amount = _.sample(['small', 'midle', 'big']);
            const quantity = _.sample(['small', 'midle', 'big']);
            await StockModel.createStock(name, amount, price, quantity);
        });
        // Создание дополнений
        const additions = [];
        for (let i = 0; i < 50; i++) {
            const name = faker.commerce.productName();

            additions.push(name);
        }
        additions.forEach(async (name) => {
            const price = faker.commerce.price();
            const addition = await AdditionModel.createAddition(name, price);
            const randomStock = _.sample(stock);
            await AdditionModel.addStockToAddition(addition.id, randomStock);
        });

        // Создание продуктов
        const amount = ['small', 'midle', 'big'];
        const products = [];
        for (let i = 0; i < 50; i++) {
            const name = faker.commerce.productName();
            const description = faker.lorem.sentence();
            products.push({ name, description });
        }

        products.forEach(async ({ name, description }) => {
            const randomStock = _.sampleSize(stock, 3);
            const randomAdditions = _.sampleSize(additions, 3);
            const randomCategory = _.sample(category);
            amount.forEach(async (amount) => {
                const price = faker.commerce.price();
                const product = await ProductModel.createProduct(name, amount, price, description);
                await ProductModel.addStockToProduct(product.id, randomStock);
                await ProductModel.addAdditionToProduct(product.id, randomAdditions);
                await ProductModel.addCategoryToProduct(product.id, randomCategory);
            });
        });

        logger.info('Test data created successfully');
    } catch (error) {
        logger.error('Error creating test data:', error);
    }
}

createTestData();
