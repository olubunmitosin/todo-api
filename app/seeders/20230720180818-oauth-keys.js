'use strict';
const cryptoService = require("../utils/cryptoService");

module.exports = {
  up: (models, mongoose) => {
    // Generate private and public keys
    return new Promise(function(resolve, reject) {
        resolve(cryptoService.generatePrivateKey());
    });
  },

  down: (models, mongoose) => {
    //
  }
};
