const jwt = require('jsonwebtoken');
const cryptoService = require("../utils/cryptoService");
const {is_null} = require("locutus/php/var");
const {bin2hex} = require("locutus/php/strings");
const models = require("../models/index.js")['default'];

/**
 * Get access token
 * @param bearerToken
 * @param callback
 */
exports.getAccessToken = async function (bearerToken, callback) {
    // Get key
    const privateKey = cryptoService.readPrivateKey();
    jwt.verify(bearerToken,  privateKey, async function (err, decoded) {
        if (!err) {
                const client = await models.Client.findOne({_id: decoded.id}).exec();
                return callback(false, {
                    user: client,
                    hash: decoded.hash
                });
        } else {
            callback(err, false);
        }
    });
};


exports.generateAccessToken = async function (client) {
    const {generateRandomString} = require("../utils/utilityService");
    const hash =  bin2hex(generateRandomString(32));
    let payload = {
        id: client._id,
        username: client.username,
        name: client.name,
        hash: hash,
        iat: Math.floor(Date.now() / 1000) + 257
    };

    // Get key
    const privateKey = cryptoService.readPrivateKey();
    // Sign options
    const verifyOptions = {
        issuer:  process.env.APP_CODE,
        subject:  process.env.APP_CODE + "_JWT",
        expiresIn: '1d',
        algorithm: 'RS256',
        header: {
            typ: 'JWT',
        },
    }

    const token = jwt.sign(payload, privateKey, verifyOptions);
    return token
};

