const { OrderDB, ProductDB, AdditionDB, ProductInOrderDB } = require('../database/modelDB');
const { logger } = require('../utils/logger');
const { Sequelize } = require('sequelize');

class OrderModel {
    static async getOrderById(id) {
        try {
            const resultOrder = await OrderDB.findByPk(id, {
                include: [
                    {
                        model: ProductDB,
                        through: {
                            model: ProductInOrderDB,
                        },
                    },
                ],
            });

            for (const product of resultOrder.Products) {
                const productInOrder = product.ProoductsOrder;
                const additions = await productInOrder.getAdditions();

                const cleanedAdditions = additions.map((addition) => {
                    const { additions_in_product_in_order, ...rest } = addition.toJSON();
                    return rest;
                });
                product.setDataValue('Additions', cleanedAdditions);
            }

            return resultOrder;
        } catch (error) {
            logger.error('Error getting order by ID:', error);
            throw error;
        }
    }

    static async getAllOrders() {
        try {
            const allOrders = await OrderDB.findAll({
                include: [
                    {
                        model: ProductDB,
                        through: {
                            model: ProductInOrderDB,
                        },
                    },
                ],
            });

            for (const order of allOrders) {
                for (const product of order.Products) {
                    const productInOrder = product.ProoductsOrder;
                    const additions = await productInOrder.getAdditions();

                    const cleanedAdditions = additions.map((addition) => {
                        const { additions_in_product_in_order, ...rest } = addition.toJSON();
                        return rest;
                    });
                    product.setDataValue('Additions', cleanedAdditions);
                }
            }

            return allOrders;
        } catch (error) {
            logger.error('Error getting all orders:', error);
            throw error;
        }
    }

    static async getAllOrdersForWorker() {
        try {
            const allOrders = await OrderDB.findAll({
                where: {
                    status: {
                        [Sequelize.Op.not]: ['done', 'cancel'],
                    },
                },
                include: [
                    {
                        model: ProductDB,
                        through: {
                            model: ProductInOrderDB,
                        },
                    },
                ],
            });

            for (const order of allOrders) {
                for (const product of order.Products) {
                    const productInOrder = product.ProoductsOrder;
                    const additions = await productInOrder.getAdditions();

                    const cleanedAdditions = additions.map((addition) => {
                        const { additions_in_product_in_order, ...rest } = addition.toJSON();
                        return rest;
                    });
                    product.setDataValue('Additions', cleanedAdditions);
                }
            }

            return allOrders;
        } catch (error) {
            logger.error('Error getting all orders:', error);
            throw error;
        }
    }

    static async createOrderWithProductsAndAdditions({ data, user_id, comment, payment }) {
        try {
            const order = await OrderDB.create({
                status: 'pending',
                payment: payment || 'unpaid',
                comment: comment || null,
                user_id: user_id || null,
                totalPrice: null,
            });
            let totalPriceCount = 0;
            // console.log(Object.getPrototypeOf(order));
            for (const item of data) {
                const product = await ProductDB.findByPk(item.product_id);
                totalPriceCount += product.price * item.count;
                if (!product) {
                    throw new Error('Product not found in order');
                }
                const [productInOrder] = await order.addProduct(product, { through: { count: item.count } });

                for (const addition_id of item.addition_ids) {
                    const addition = await AdditionDB.findByPk(addition_id);

                    if (!addition) {
                        throw new Error('Addition not found in order');
                    }
                    totalPriceCount += addition.price * item.count;
                    await productInOrder.addAddition(addition, { through: { count: 1 } });
                }
            }

            order.totalPrice = totalPriceCount;
            await order.save();

            return this.getOrderById(order.id);
        } catch (error) {
            logger.error('Error creating order:', error);
        }
    }

    static async removeAdditionFromOrder(order_id, product_id, addition_id) {
        try {
            const order = await OrderDB.findByPk(order_id);

            if (!order) {
                throw new Error('Order not found');
            }

            const allProduct = await order.getProducts({ through: ProductInOrderDB });
            const product = allProduct.find((product) => product.id == product_id);

            if (!product) {
                throw new Error('Product not found in order');
            }

            const productInOrder = product.ProoductsOrder;

            const addition = await AdditionDB.findByPk(addition_id);

            if (!addition) {
                throw new Error('Addition not found in order');
            }

            await productInOrder.removeAddition(addition);
            order.totalPrice -= addition.price * productInOrder.count;
            await order.save();
            return this.getOrderById(order_id);
        } catch (error) {
            logger.error('Error removing product and addition from order:', error);
        }
    }

    static async decreaseProductCountInOrder(order_id, product_id) {
        try {
            const order = await OrderDB.findByPk(order_id);
            // console.log(Object.getPrototypeOf(order));
            if (!order) {
                throw new Error('Order not found');
            }

            const allProduct = await order.getProducts({ through: ProductInOrderDB });
            const product = allProduct.find((product) => product.id == product_id);
            const productInOrder = product.ProoductsOrder;
            const additions = await productInOrder.getAdditions();
            if (!productInOrder) {
                throw new Error('Product not found in order');
            }
            // price
            additions.forEach((i) => {
                order.totalPrice -= i.price;
            });
            order.totalPrice -= product.price;
            // count
            productInOrder.count -= 1;
            await productInOrder.save();

            if (productInOrder.count < 1) {
                await order.removeProduct(product);
                // If product in order not exist - delete order
                const productsInOrder = await order.getProducts();
                if (productsInOrder.length === 0) {
                    await OrderDB.destroy({ where: { id: order_id } });
                    return null;
                }
            }
            await order.save();
            return this.getOrderById(order_id);
        } catch (error) {
            logger.error('Error decreasing product count in order:', error);
        }
    }
}

module.exports = OrderModel;
