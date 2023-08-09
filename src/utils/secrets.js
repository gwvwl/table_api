require('dotenv/config');

const { logger } = require('./logger');

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, HOST_APP, JWT_REFRESH_SECRET, JWT_ACCESS_SECRET, ADMIN_LOGIN, ADMIN_PASS } =
    process.env;

const requiredCredentials = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'JWT_REFRESH_SECRET', 'JWT_ACCESS_SECRET'];

for (const credential of requiredCredentials) {
    if (process.env[credential] === undefined) {
        logger.error(`Missing required crendential: ${credential}`);
        process.exit(1);
    }
}

module.exports = {
    DB_HOST,
    DB_USER,
    DB_PASS,
    DB_NAME,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_SECRET,
    ADMIN_PASS,
    ADMIN_LOGIN,
    HOST_APP,
};
