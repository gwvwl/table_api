const { logger } = require("../../utils/logger");
const { createTableReport, createTableUser } = require("../queries");

(() => {
  const db = require("../../config/db.config");
  db.query(createTableReport, (err, _) => {
    if (err) {
      logger.error(err.message);
      return;
    }
    logger.info("Tables report created!");
  });

  db.query(createTableUser, (err, _) => {
    if (err) {
      logger.error(err.message);
      return;
    }
    logger.info("Tables user created!");
    process.exit(0);
  });
})();
