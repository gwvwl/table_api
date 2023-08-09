const { faker } = require('@faker-js/faker');
const UserModel = require('../models/user.model');

// create workers
const worker = [];
for (let i = 0; i < 30; i++) {
    const name = faker.commerce.productName();

    worker.push(name);
}
worker.forEach(async (name) => {
    const login = faker.person.fullName();
    const password = '123';
    const type = 'worker';
    const role = 'worker';
    await UserModel.createUser({ login, password, type, role, name });
});

// createAdmin

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
const admin = [];
for (let i = 0; i < 30; i++) {
    const name = faker.commerce.productName();

    admin.push(name);
}
admin.forEach(async (name) => {
    const login = faker.person.fullName();
    const password = '123';
    const type = 'admin';
    const role = 'admin';
    await UserModel.createAdmin({ login, password, type, role, name, permission: defoultPermissionAdmin });
});

// create client
const client = [];
for (let i = 0; i < 30; i++) {
    const name = faker.commerce.productName();

    client.push(name);
}
client.forEach(async (name) => {
    const login = faker.person.fullName();
    const password = '123';
    const type = 'client';
    const role = 'client';
    await UserModel.createUser({ login, password, type, role, name });
});
