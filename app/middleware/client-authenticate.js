const {responseStructure, getLogData} = require("../utils/utilityService");
const write_logs = require("../utils/loggerService");
const { getAccessToken } = require('../config/oauth2.js');

module.exports = function clientAuthenticateRequest(req, res, next) {

    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        getAccessToken(req.headers.authorization.split(' ')[1], function(err, responseObj) {
            if (err) {
                req.locals = undefined;
                let middlewareResponse = responseStructure(err.message || "Unauthorized request", false, [])
                write_logs(getLogData(req,  middlewareResponse, 'client authentication middleware'));
                return res.status(err.code || 401).send(middlewareResponse);
              };
    
              // proceed with next request
              req.locals = responseObj;
              next();
        });

    } else {
        req.locals = undefined;
        let middlewareResponse = responseStructure("Unauthorized request", false, [])
        write_logs(getLogData(req,  middlewareResponse, 'client authentication middleware'));
        return res.status(401).send(middlewareResponse);
    }
}