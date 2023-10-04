const UserModel = require("../models/user.model");

const { ADMIN_LOGIN, ADMIN_PASS } = require("../utils/secrets");

const admin = {
  login: ADMIN_LOGIN,
  password: ADMIN_PASS,
};

async function start() {
  const userNew = await UserModel.createUser(admin);
  const data = await UserModel.getUserById(userNew.id);
  console.log(data.toJSON());
  return data;
}
start();
