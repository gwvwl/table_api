const User = require("../models/user.model");

exports.signup = (req, res) => {
  const { name, email, phone, position } = req.body;
  const file = req.files.photo;

  // upload photo
  const id_img_and_format = Date.now() + "." + file.name.split(".").pop();
  file.mv(__dirname + "/../upload/" + id_img_and_format);
  const photo = process.env.HOST + "/" + id_img_and_format;

  // create a new user
  const positionSwitch = {
    1: "Frontend developer",
    2: "Backend developer",
    3: "Designer",
    4: "QA",
  };
  const user = new User(
    name.trim(),
    email.trim(),
    phone.trim(),
    positionSwitch[position],
    photo.trim()
  );

  User.create(user, (err, data) => {
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

exports.users = (req, res) => {
  const offset = parseInt(req.query.offset);

  const total_count = (offset, cb) =>
    User.findCountBase((err, data) => {
      if (err) {
        res.status(500).send({
          status: "error",
          message: err.message,
        });
      } else {
        cb(offset, data);
        return;
      }
    });

  const getUsers = (offset, count) =>
    User.findUsers(offset, (err, data) => {
      if (err) {
        res.status(500).send({
          status: "error",
          message: err.message,
        });
      } else {
        res.status(201).send({
          status: true,
          total_count: count.count,
          users: data,
        });
      }
    });
  total_count(offset, getUsers);
};
