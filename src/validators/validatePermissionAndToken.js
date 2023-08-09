const { decodeAccsess } = require('../utils/token');

const validatePermission = (access) => (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = (authHeader && authHeader.split(' ')[1]) || authHeader;
    const verifyToken = decodeAccsess(token);

    if (!verifyToken) {
        res.status(401).send({
            status: 'error',
            message: 'token is invalid',
        });
        return;
    }

    if (!verifyToken?.permissions.includes(access)) {
        res.status(403).send({
            status: 'error',
            message: 'access is invalid',
        });
        return;
    }
    req.user = { id: verifyToken.id };
    next();
};

module.exports = validatePermission;
