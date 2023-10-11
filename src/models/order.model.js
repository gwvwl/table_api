const { OrderDB } = require("../database/modelDB");
const { logger } = require("../utils/logger");
class AdditionModel {
  static async createAddition({
    type,
    phone,
    name,
    date,
    customs,
    details,
    agencyTitle,
  }) {
    try {
      const order = await OrderDB.create({
        type,
        phone,
        name,
        date,
        customs,
        details,
        agencyTitle,
      });

      return order;
    } catch (error) {
      logger.error("Error creating order:", error);
      throw error;
    }
  }

  static async getOrderById(id) {
    try {
      const addition = await OrderDB.findOne({
        where: { id },
      });
      return addition;
    } catch (error) {
      logger.error("Error getting addition by id:", error);
      throw error;
    }
  }

  static async getAllOrders({ offset = 0, limit = 25, dateFilter = {} }) {
    try {
      const total = await OrderDB.count({ where: dateFilter });
      const orders = await OrderDB.findAll({
        where: dateFilter,
        order: [["date", "ASC"]],
        offset: offset,
        limit: limit,
      });
      return { orders, total };
    } catch (error) {
      logger.error("Error getting all orders:", error);
      throw error;
    }
  }
}

module.exports = AdditionModel;
