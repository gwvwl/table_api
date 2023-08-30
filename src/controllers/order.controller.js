const OrderModel = require('../models/order.model');

const { decodeAccsess } = require('../utils/token');
exports.createOrder = async (req, res) => {
    const { data, payment } = req.body;

    if (data.length === 0) {
        return res.status(404).send({ success: false, message: 'Not found order data' });
    }
    const authHeader = req.headers['authorization'];
    // get user_id from token if not exist pass false
    const token = (authHeader && authHeader.split(' ')[1]) || authHeader;
    const verifyToken = token && decodeAccsess(token);
    const user_id = verifyToken ? verifyToken.id : null;

    const order = await OrderModel.createOrderWithProductsAndAdditions({
        data,
        user_id,
        payment,
    });

    res.status(200).send({ success: true, message: 'Order created', order });
};

exports.getOrders = async (req, res) => {
    const { id } = req.query;

    let orders;

    if (id) {
        const order = await OrderModel.getOrderById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        orders = [order];
    } else {
        orders = await OrderModel.getAllOrders();
    }

    res.status(200).json({ success: true, message: 'Orders retrieved', orders });
};
exports.getOrdersForWorker = async (req, res) => {
    const orders = await OrderModel.getAllOrdersForWorker();

    res.status(200).json({ success: true, message: 'Orders retrieved', orders });
};

exports.updateStatus = async (req, res) => {
    const { order_id } = req.params;
    const { status } = req.body;
    const user_id = req.user.id;

    const order = await OrderModel.getOrderById(order_id);

    if (!order) {
        return res.status(404).send({ success: false, message: 'Order not found' });
    }

    order.status = status;
    order.updatedBy = user_id;

    await order.save();

    res.status(200).send({ success: true, message: 'Order status updated', order });
};

exports.updatePayment = async (req, res) => {
    const { order_id } = req.params;
    const { payment } = req.body;
    const user_id = req.user.id;

    const order = await OrderModel.getOrderById(order_id);

    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.payment = payment;
    order.updatedBy = user_id;

    await order.save();

    res.status(200).send({
        success: true,
        message: 'Order payment status updated',
        order: order,
    });
};

exports.updateOrdeAllInput = async (req, res) => {
    const { order_id } = req.params;
    const { status, payment, comment } = req.body;

    const order = await OrderModel.getOrderById(order_id);

    if (!order) {
        return res.status(404).send({ success: false, message: 'Order not found' });
    }

    // Обновление полей `order`
    order.status = status || order.status;
    order.payment = payment || order.payment;
    order.comment = comment || order.comment;

    await order.save();

    res.status(200).send({ success: true, message: 'Order updated', order });
};

exports.deleteAdditionFromProductOrder = async (req, res) => {
    const { order_id } = req.params;
    const { product_id, addition_id } = req.query;
    const order = await OrderModel.removeAdditionFromOrder(order_id, product_id, addition_id);

    res.status(200).json({ success: true, message: 'Addition delete from Order', order });
};

exports.deleteProductFromOrder = async (req, res) => {
    const { order_id } = req.params;
    const { product_id } = req.query;

    const order = await OrderModel.decreaseProductCountInOrder(order_id, product_id);

    res.status(200).json({ success: true, message: 'Product delete from Order', order });
};
