const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const authRoute = require("./routes/auth.route");
const tokenRoute = require("./routes/token.route");
const usersRoute = require("./routes/users.route");

const { httpLogStream } = require("./utils/logger");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(morgan("combined", { stream: httpLogStream }));
app.use(cors());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.use(express.static(__dirname + "/upload"));

app.use("/api/auth", authRoute);
app.use("/api", tokenRoute);
app.use("/api", usersRoute);

app.get("/", (req, res) => {
  res.status(200).send({
    status: "success",
    data: {
      message: "API working fine",
    },
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    status: "error",
    message: err.message,
  });
  next();
});

module.exports = app;
