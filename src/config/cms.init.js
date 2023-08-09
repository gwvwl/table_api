const UserModel = require('../models/user.model');

const PermissionModel = require('../models/permission.model');

const { ADMIN_LOGIN, ADMIN_PASS } = require('../utils/secrets');
const defoultPermissionAdmin = [
    // worker
    'read_order_not_done',

    // admin
    'work_with_user',
    'create_worker',
    // permission
    'work_with_permission',

    // work with Product and additions
    'work_with_menu',
    // work with orders
    'read_all_order',
    'work_with_role',

    'work_with_analitics',
];

const admin = {
    name: 'Valera',
    login: ADMIN_LOGIN,
    password: ADMIN_PASS,
    permission: defoultPermissionAdmin,
};

async function start() {
    await PermissionModel.createPermission(defoultPermissionAdmin);
    const userNew = await UserModel.createAdmin(admin);
    const data = await UserModel.getUserById(userNew.id);
    console.log(data.toJSON());

    return data;
}
start();
