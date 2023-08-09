const RoleModel = require('../models/roles.model');

exports.createRole = async (req, res) => {
    const { name } = req.body;

    const role = await RoleModel.createRole(name);
    res.status(201).json({ success: true, message: 'Role created', role });
};
exports.getRole = async (req, res) => {
    const { id } = req.query;

    let roles;

    if (id) {
        const role = await RoleModel.getRoleById(id);
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }
        roles = [role];
    } else {
        roles = await RoleModel.getAllRoles();
    }

    res.status(200).json({ success: true, message: 'Roles retrieved', roles });
};

exports.updateRole = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const updatedRole = await RoleModel.updateRole(id, { name });
    res.status(200).json({ success: true, message: 'Role updated', role: updatedRole });
};

exports.deleteRole = async (req, res) => {
    const { id } = req.params;

    await RoleModel.deleteRole(id);
    res.status(200).json({ success: true, message: 'Role deleted' });
};
