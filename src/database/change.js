const userModel = require("../models/user.model");
const { hash: hashPassword } = require("../utils/password");
async function pas() {
  user = await userModel.getUserByLogin("admin");
  user.password = hashPassword("1234");
  user.save();
}
pas();
