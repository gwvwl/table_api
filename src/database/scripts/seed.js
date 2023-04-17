const { faker } = require("@faker-js/faker");
const { logger } = require("../../utils/logger");

const numberOfRecords = 500;
const data = [];

for (let i = 0; i < numberOfRecords; i++) {
  const driverName = faker.name.firstName();
  const trailer = faker.vehicle.vehicle();
  const driverPassport = faker.random.alphaNumeric(10);
  const driverPhone = faker.random.alphaNumeric(10);
  const driverLicense = faker.random.alphaNumeric(10);
  const transportId = faker.random.alphaNumeric(10);
  const transportName = faker.vehicle.model();
  const culture = faker.vehicle.model();
  const port = faker.address.city();
  const transportType = faker.vehicle.model();
  const createdOn = faker.date.past();

  const record = [
    driverName,
    trailer,
    driverPassport,
    driverPhone,
    driverLicense,
    transportId,
    transportName,
    culture,
    port,
    transportType,
    createdOn,
  ];

  data.push(record);
}

const query = `INSERT INTO gvl328_table.report (
  driver_name,
  trailer,
  driver_passport,
  driver_phone,
  driver_license,
  transport_id,
  transport_name,
  culture,
  port,
  transport_type,
  created_on
) VALUES ?`;

require("../../config/db.config.init").query(
  query,
  [data],
  (error, results, fields) => {
    if (error) {
      logger.error("Ошибка при вставке данных:", error);
    }

    logger.info(
      `Успешно добавлено ${results.affectedRows} записей в таблицу "report"!`
    );
    process.exit(0);
  }
);
