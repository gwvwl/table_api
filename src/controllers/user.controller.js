const UserModel = require('../models/user.model');
const { generateTokens, saveToken, decodeRefresh } = require('../utils/token');

exports.signup = async (req, res) => {
    const { name, login, password } = req.body;

    try {
        const regUser = await UserModel.createUser({
            name,
            login,
            password,
        });

        const token = generateTokens({ id: regUser.id, type: regUser.type });
        await saveToken(regUser.id, token.refresh);

        res.cookie('refreshToken', token.refresh, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        res.status(201).send({
            success: true,
            access: token.access,
            data: {
                id: regUser.id,
                name: regUser.name,
                login: regUser.login,
                type: regUser.type,
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

exports.updateUser = async (req, res) => {
    const userId = req.user.id;
    const newName = req.body.name;

    try {
        const user = await UserModel.getUserById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.name = newName || user.name;
        await user.save();

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const deletedUser = await UserModel.deleteUser(userId);
        res.json({ success: true, deletedUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

exports.getUserOrderHistory = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await UserModel.getUserById(userId);
        const orderHistory = user ? user.Orders : [];
        res.json({ success: true, orderHistory });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user order history' });
    }
};

// for admin

exports.createWorker = async (req, res) => {
    const { login, password, name } = req.body;

    try {
        const worker = await UserModel.createUser({ name, login, password, type: 'worker', role: 'worker' });

        res.status(200).send({ success: true, message: 'Worker create', worker });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create worker' });
    }
};

exports.createAdmin = async (req, res) => {
    const { login, password, name } = req.body;

    try {
        const worker = await UserModel.createUser({ name, login, password, type: 'admin', role: 'admin' });

        res.status(200).send({ success: true, message: 'Worker create', worker });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create worker' });
    }
};

exports.deleteAnyUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await UserModel.deleteUser(id);
        res.status(200).send({
            success: true,
            message: ` user ${deletedUser.name} delete`,
            user_type: deletedUser.type,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

exports.getUserTypeAdmin = async (req, res) => {
    try {
        const admins = await UserModel.getUserByType('admin');
        res.status(200).send({ success: true, data: admins });
    } catch (error) {
        res.status(500).send({ error: 'Failed to get admins' });
    }
};
exports.getUserTypeWorker = async (req, res) => {
    try {
        const workers = await UserModel.getUserByType('worker');
        res.status(200).send({ success: true, data: workers });
    } catch (error) {
        res.status(500).send({ error: 'Failed to get workers' });
    }
};

exports.getUserTypeClient = async (req, res) => {
    try {
        const client = await UserModel.getUserByType('client');
        res.status(200).send({ success: true, data: client });
    } catch (error) {
        res.status(500).send({ error: 'Failed to get client' });
    }
};

exports.putUserForAdmin = async (req, res) => {
    const { id } = req.params;
    const { login, name } = req.body;

    try {
        const user = await UserModel.getUserById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.name = name || user.name;
        user.login = login || user.login;
        await user.save();
        res.status(200).send({ success: true, user });
    } catch (error) {
        res.status(500).send({ error: 'Failed to update user' });
    }
};

exports.addPermissionsç = async (req, res) => {
    const { id } = req.params;
    const { permussions } = req.body;
    try {
        const user = await UserModel.grantPermissions(id, permussions);
        res.status(200).send({ success: true, user });
    } catch (error) {
        res.status(500).send({ error: 'Failed to add permussion' });
    }
};
exports.removePermissionsFromUser = async (req, res) => {
    const { id } = req.params;
    const { permussions } = req.body;
    try {
        const user = await UserModel.revokePermissions(id, permussions);
        res.status(200).send({ success: true, user });
    } catch (error) {
        res.status(500).send({ error: 'Failed to revoke permussions' });
    }
};
