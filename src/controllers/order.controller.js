const OrderModel = require("../models/order.model");
const { Op } = require("sequelize");
exports.createOrder = async (req, res) => {
  const { type, phone, name, date, customs, details } = req.body;

  try {
    const order = await OrderModel.createAddition({
      type,
      phone,
      name,
      date,
      customs,
      details,
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

// exports.updateOrder= async (req, res) => {
//     const { id } = req.params;
//     const { name, price, stock } = req.body;
//     //  img
//     const file = req?.files?.img;

//     const id_img_and_format = Date.now() + '.' + file?.name.split('.').pop();
//     file?.mv(__dirname + '/../upload/' + id_img_and_format);
//     const img_path = file ? 'http://localhost:8080/' + id_img_and_format : '';
//     const addition = await AdditionModel.getAdditionById(id);

//     if (!addition) {
//         return res.status(404).send({ success: false, message: 'Addition not found or name' });
//     }

//     addition.name = name || addition.name;
//     addition.price = price || addition.price;
//     addition.img_path = img_path || addition.img_path;
//     // stock
//     if (stock) await AdditionModel.addStockToAddition(id, stock);
//     await addition.save();
//     res.status(200).send({ success: true, message: 'Addition updated', addition });
// };
