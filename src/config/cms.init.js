const UserModel = require("../models/user.model");

const { ADMIN_LOGIN, ADMIN_PASS } = require("../utils/secrets");

const admin = {
  login: ADMIN_LOGIN,
  password: ADMIN_PASS,
  type: "admin",
};
const guida = {
  login: "guida",
  password: "123",
  type: "user",
};

async function start() {
  const adminUser = await UserModel.createUser(admin);
  const guidaUser = await UserModel.createUser(guida);
  const data = await UserModel.getUserById(adminUser.id);
  console.log(data.toJSON());
  return data;
}
start();
