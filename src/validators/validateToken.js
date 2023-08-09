const { decodeAccsess } = require('../utils/token');

const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = (authHeader && authHeader.split(' ')[1]) || authHeader;

    const verifyToken = decodeAccsess(token);
    if (!verifyToken) {
        res.status(401).send({
            status: 'error',
            message: 'Token is invalid',
        });
        return;
    }

    // add id from token to req
    req.user = { id: verifyToken.id };

    next();
};

module.exports = validateToken;
