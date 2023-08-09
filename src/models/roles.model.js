const { RoleDB, UserDB } = require('../database/modelDB');
const { logger } = require('../utils/logger');
class RoleModel {
    static async createRole(name) {
        try {
            const [role] = await RoleDB.findOrCreate({
                where: { name },
                defaults: { name },
            });

            return role;
        } catch (error) {
            logger.error('Error creating role:', error);
            throw error;
        }
    }

    static async getRoleById(id) {
        try {
            const role = await RoleDB.findByPk(id, {
                include: { model: UserDB, through: { attributes: [] } },
            });
            return role;
        } catch (error) {
            logger.error('Error getting role by ID:', error);
            throw error;
        }
    }

    static async getAllRoles() {
        try {
            const roles = await RoleDB.findAll({
                include: { model: UserDB, through: { attributes: [] } },
            });
            return roles;
        } catch (error) {
            logger.error('Error getting all roles:', error);
            throw error;
        }
    }

    static async updateRole(id, newData) {
        try {
            const [updatedRowsCount, updatedRows] = await RoleDB.update(newData, {
                where: { id },
                returning: true,
            });

            if (updatedRowsCount === 0) {
                throw new Error('Role not found');
            }

            const updatedRole = updatedRows[0];
            return updatedRole;
        } catch (error) {
            logger.error('Error updating role:', error);
            throw error;
        }
    }

    static async deleteRole(id) {
        try {
            const deletedRole = await RoleDB.destroy({ where: { id } });
            return deletedRole;
        } catch (error) {
            logger.error('Error deleting role:', error);
            throw error;
        }
    }
}

module.exports = RoleModel;
