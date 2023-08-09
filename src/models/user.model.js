const { UserDB, RoleDB, PermissionDB, OrderDB, FavoritePositionDB } = require('../database/modelDB');
const { hash: hashPassword } = require('../utils/password');
const { logger } = require('../utils/logger');
const RoleModel = require('./roles.model');

class UserModel {
    static async getUserById(id) {
        try {
            const user = await UserDB.findByPk(id, {
                include: [
                    { model: RoleDB, through: { attributes: [] } },
                    { model: PermissionDB, through: { attributes: [] } },
                    { model: OrderDB },
                    { model: FavoritePositionDB },
                ],
            });
            return user;
        } catch (error) {
            logger.error('Error getting user by ID:', error);
            throw error;
        }
    }

    static async getUserByLogin(login) {
        try {
            const user = await UserDB.findOne({
                where: { login },
                include: [
                    { model: RoleDB, through: { attributes: [] } },
                    { model: PermissionDB, through: { attributes: [] } },
                    { model: OrderDB },
                    { model: FavoritePositionDB },
                ],
            });
            return user;
        } catch (error) {
            logger.error('Error getting user by login:', error);
        }
    }

    // input: 'admin', 'worker', 'client'
    static async getUserByType(user_type) {
        try {
            const user = await UserDB.findAll({
                where: { type: user_type },
                include: [
                    { model: RoleDB, through: { attributes: [] } },
                    { model: PermissionDB, through: { attributes: [] } },
                    { model: OrderDB },
                    { model: FavoritePositionDB },
                ],
            });
            return user;
        } catch (error) {
            logger.error('Error getting user by type:', error);
        }
    }
    static async deleteUser(id) {
        try {
            const user = await this.getUserById(id);
            await UserDB.destroy({ where: { id } });
            return user;
        } catch (error) {
            logger.error('Error deleting user:', error);
            throw error;
        }
    }
    static async createUser({ name, login, password, type = 'client', role = 'client', permission = false }) {
        try {
            const user = await UserDB.create({
                name,
                type,
                login,
                password: hashPassword(password),
            });
            // find or create input role
            const userRole = await RoleModel.createRole(role);
            // add role to user
            await user.addRole(userRole);
            // add  permissions,
            if (permission) {
                await user.addPermissions(permission);
            }

            return user;
        } catch (error) {
            logger.error('Error creating user:', error);
            throw error;
        }
    }
    static async createAdmin({ name, login, password, type = 'admin', role = 'admin', permission }) {
        try {
            const user = await UserDB.create({
                name,
                type,
                login,
                password: hashPassword(password),
            });
            // find or create input role
            const userRole = await RoleModel.createRole(role);
            // add role to user
            await user.addRole(userRole);
            //  add all permissions,
            await UserModel.grantPermissions(user.id, permission);

            return user;
        } catch (error) {
            logger.error('Error creating user:', error);
        }
    }

    static async grantPermissions(userId, permissionNames) {
        try {
            const user = await UserDB.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const permissions = await PermissionDB.findAll({
                where: { name: permissionNames },
            });

            if (permissions.length === 0) {
                throw new Error('Permission not found');
            }

            await user.addPermissions(permissions);

            return this.getUserById(user.id);
        } catch (error) {
            console.error('Error granting permissions:', error);
            throw error;
        }
    }

    static async revokePermissions(userId, permissionNames) {
        try {
            const user = await UserDB.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const userPermissions = await user.getPermissions();

            const permissionsToRemove = userPermissions.filter((permission) =>
                permissionNames.includes(permission.name),
            );

            await user.removePermissions(permissionsToRemove);

            return this.getUserById(user.id);
        } catch (error) {
            console.error('Error revoking permissions:', error);
            throw error;
        }
    }
}

module.exports = UserModel;
