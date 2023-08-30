const PermissionModel = require('../models/permission.model');
const UserModel = require('../models/user.model');
exports.getPermission = async (req, res) => {
    // const { id } = req.query;

    // if (id) {
    const permissions = await PermissionModel.getAllPermissions();

    return res.status(200).send({
        success: true,
        data: permissions,
    });
    // } else {
    //     const allPermissions = await PermissionModel.getAllPermissions();
    //     return res.status(200).send({
    //         success: true,
    //         data: allPermissions.map(({ name }) => name),
    //     });
    // }
};

exports.addPermission = async (req, res) => {
    const { user_id, permission_name } = req.body;

    const permission = await UserModel.grantPermissions(user_id, permission_name);

    res.status(200).send({
        success: true,
        message: `Permission '${permission.name}' granted to user `,
        user_type: permission.type,
    });
};

exports.removePermission = async (req, res) => {
    const { user_id, permission_name } = req.query;

    const permission = await UserModel.revokePermissions(user_id, permission_name);

    res.status(200).send({
        success: true,
        message: `Permission '${permission.name}' revoked from user'`,
        user_type: permission.type,
    });
};
