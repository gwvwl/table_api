const OrderModel = require("../models/order.model");
const { Op } = require("sequelize");
exports.createOrder = async (req, res) => {
  const { type, phone, name, date, customs, details, agencyTitle } = req.body;

  try {
    const order = await OrderModel.createAddition({
      type,
      phone,
      name,
      date,
      customs,
      details,
      agencyTitle,
    });

    res
      .status(200)
      .json({ success: true, message: "OrderModel created", order });
  } catch (error) {
    console.error("Error creating OrderModel:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create OrderModel" });
  }
};
exports.getOrder = async (req, res) => {
  const { id, offset = 0, limit = 25, date_between } = req.query;

  try {
    let orders;

    if (id) {
      const order = await OrderModel.getOrderById(id);
      if (!order) {
        return res
          .status(404)
          .send({ success: false, message: "Order not found" });
      }
      orders = [order];
    } else {
      let dateFilter = {};

      if (date_between) {
        const [startDate, endDate] = date_between.split(",");
        dateFilter = {
          date: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        };
      }

      orders = await OrderModel.getAllOrders({
        offset: parseInt(offset, 10),
        limit: parseInt(limit, 10),
        dateFilter,
      });
    }

    res
      .status(200)
      .send({ success: true, data: orders.orders, total: orders.total });
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  const order = await OrderModel.getOrderById(id);

  if (!order) {
    return res.status(404).json({ success: false, message: "order not found" });
  }

  await order.destroy();

  res.status(200).send({ success: true, message: "order deleted" });
};

// exports.getOrder = async (req, res) => {
//   const { id } = req.query;

//   let additions;

//   if (id) {
//     const addition = await OrderModel.getAdditionById(id);
//     if (!addition) {
//       return res
//         .status(404)
//         .send({ success: false, message: "OrderModel not found" });
//     }
//     additions = [addition];
//   } else {
//     additions = await OrderModel.getAllAdditions();
//   }

//   res.status(200).send({ success: true, data: additions });
// };

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { details, customs, date } = req.body;

  const order = await OrderModel.getOrderById(id);

  if (!order) {
    return res
      .status(404)
      .send({ success: false, message: "Order not found " });
  }

  order.details = details || order.details;
  order.customs = customs || order.customs;
  order.date = date || order.date;

  await order.save();
  res.status(200).send({ success: true, message: "order updated", order });
};
