const { faker, fakerRU } = require("@faker-js/faker");
const _ = require("lodash");
const { logger } = require("../utils/logger");
const OrderModel = require("../models/order.model");

// type, phone, name, date, customs, details

async function createTestData() {
  try {
    const order = [];
    for (let i = 0; i < 100; i++) {
      const name = faker.person.firstName();
      order.push(name);
    }
    order.forEach(async (i) => {
      await OrderModel.createAddition({
        name: i,
        type: faker.company.name(),
        phone: faker.phone.number(),
        date: faker.date.anytime(),
        customs: 4,
        details: faker.lorem.sentence(),
      });
    });

    logger.info("Test data created successfully");
  } catch (error) {
    logger.error("Error creating test data:", error);
  }
}

createTestData();
