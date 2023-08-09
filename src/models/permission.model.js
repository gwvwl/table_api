const { PermissionDB } = require('../database/modelDB');
const { logger } = require('../utils/logger');
class PermissionModel {
    static async createPermission(names) {
        try {
            if (Array.isArray(names)) {
                const existingPermissions = await PermissionDB.findAll({
                    where: { name: names },
                });

                const existingPermissionNames = existingPermissions.map((permission) => permission.name);

                const newPermissions = names
                    .filter((name) => !existingPermissionNames.includes(name))
                    .map((name) => ({ name }));

                const permissions = await PermissionDB.bulkCreate(newPermissions);
                return [...existingPermissions, ...permissions];
            } else {
                const [permission] = await PermissionDB.findOrCreate({
                    where: { name: names },
                    defaults: { name: names },
                });
                return permission || null;
            }
        } catch (error) {
            logger.error('Error creating permission:', error);
            throw error;
        }
    }

    static async getAllPermissions() {
        try {
            const permissions = await PermissionDB.findAll();

            return permissions;
        } catch (error) {
            logger.error('Error granting all permissions:', error);
            throw error;
        }
    }
}

module.exports = PermissionModel;
