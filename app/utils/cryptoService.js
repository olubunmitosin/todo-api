const crypto = require("crypto");
const fs = require('fs');
require("dotenv").config();

exports.generatePrivateKey = () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,

        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },

        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            //cipher: 'aes-256-cbc',
            //passphrase: process.env.APP_CODE
        }
    });

    let privateFileName = "storage/keys/private.pem";
    let publicFileName = "storage/keys/public.pem";
    fs.writeFileSync(privateFileName, privateKey, {flag:'w'});
    fs.writeFileSync(publicFileName, publicKey, {flag:'w'});
}

exports.readPrivateKey  = () => {
    return fs.readFileSync("storage/keys/private.pem", "utf-8");
}

exports.readPublicKey = () => {
    return fs.readFileSync("storage/keys/public.pem", "utf-8");
}