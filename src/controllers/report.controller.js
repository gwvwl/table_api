const Report = require("../models/report.model");
const { changeDateFormat } = require("../utils/formatDate");

exports.createReport = (req, res) => {
  const {
    culture,
    port,
    transport_type,
    transport_name,
    transport_id,
    trailer,
    driver_name,
    driver_passport,
    driver_license,
    driver_phone,
  } = req.body;
  console.log(req.body);

  // create a new user

  const reportNew = new Report(
    culture.trim(),
    port.trim(),
    transport_type.trim(),
    transport_name.trim(),
    transport_id.trim(),
    trailer.trim(),
    driver_name.trim(),
    driver_passport.trim(),
    driver_license.trim(),
    driver_phone.trim()
  );

  Report.create(reportNew, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err,
      });
    } else {
      res.status(201).send({
        success: true,
        data,
      });
    }
  });
};

exports.getReport = (req, res) => {
  const queries = req.query;

  const total_count = (queries, cb) =>
    Report.findCountBase(queries, (err, countBase) => {
      if (err) {
        res.status(500).send({
          status: "error",
          message: err.message,
        });
      } else {
        cb(queries, countBase);
        return;
      }
    });

  const getUsers = (queries, countBase) =>
    Report.findReport(queries, (err, data) => {
      if (err) {
        res.status(500).send({
          status: "error",
          message: err.message,
        });
      } else {
        res.status(201).send({
          status: true,
          total_count: countBase.count,
          data: changeDateFormat(data),
        });
      }
    });
  total_count(queries, getUsers);
};

exports.putReport = (req, res) => {
  const { id } = req.params;
  const bodyAndQuery = { ...req.body, id };

  Report.putReport(bodyAndQuery, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err,
      });
    } else {
      res.status(201).send({
        success: true,
        data,
      });
    }
  });
};

exports.deleteReport = (req, res) => {
  const { id } = req.params;

  Report.deleteReport(id, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err,
      });
    } else {
      res.status(201).send({
        success: true,
      });
    }
  });
};
