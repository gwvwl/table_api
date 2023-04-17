const db = require("../config/db.config");
const { createReport, findReportByIdQuery } = require("../database/queries");
const { logger } = require("../utils/logger");
const { createQuery } = require("../utils/createQueryLike");

class Report {
  constructor(
    culture,
    port,
    transport_type,
    transport_name,
    transport_id,
    trailer,
    driver_name,
    driver_passport,
    driver_license,
    driver_phone
    // sender,
    // date_between
  ) {
    this.culture = culture;
    this.port = port;
    this.transport_type = transport_type;
    this.transport_name = transport_name;
    this.transport_id = transport_id;
    this.trailer = trailer;
    this.driver_name = driver_name;
    this.driver_passport = driver_passport;
    this.driver_license = driver_license;
    this.driver_phone = driver_phone;
    // this.sender = sender;
    // this.date_between = date_between;
  }

  static create(report, cb) {
    db.query(
      createReport,
      [
        report.culture,
        report.port,
        report.transport_type,
        report.transport_name,
        report.transport_id,
        report.trailer,
        report.driver_name,
        report.driver_passport,
        report.driver_license,
        report.driver_phone,
        // report.sender,
      ],
      (err, res) => {
        if (err) {
          logger.error(err.message);
          cb(err, null);
          return;
        }
        cb(null, report);
      }
    );
  }

  static async findCountBase(data, cb) {
    db.query(
      createQuery("SELECT COUNT(*) as count FROM report ", data, false),
      (err, res) => {
        if (err) {
          logger.error(err.message);
          cb(err, null);
          return;
        }
        if (res.length) {
          cb(null, res[0]);
          return;
        }
        cb({ kind: "not_found" }, null);
      }
    );
  }

  static findReport(data, cb) {
    console.log(createQuery("SELECT * FROM report ", data));
    db.query(createQuery("SELECT * FROM report ", data), (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      if (res) {
        cb(null, res);
        return;
      }
      cb({ kind: "not_found" }, null);
    });
  }

  static putReport(data, cb) {
    const {
      id,
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
    } = data;

    db.query(
      "UPDATE report SET driver_name = ?, trailer = ?, driver_passport = ?, driver_phone = ?, driver_license = ?, transport_id = ?, transport_name = ?, culture = ?, port = ?, transport_type = ? WHERE id = ?",
      [
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
        id,
      ],
      (err, res) => {
        if (err) {
          logger.error(err.message);
          cb(err, null);
          return;
        }
        if (res.affectedRows === 0) {
          cb({ kind: "not_found" }, null);
          return;
        }
        cb(null, { id, ...data });
      }
    );
  }

  static deleteReport(id, cb) {
    db.query("DELETE FROM report WHERE id = ?", id, (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      if (res.affectedRows === 0) {
        cb({ kind: "not_found" }, null);
        return;
      }
      cb(null, { id: id });
    });
  }
}

module.exports = Report;
