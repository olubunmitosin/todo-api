// Require logger
const write_logs = require("../utils/loggerService.js");
const { generateAccessToken } = require('../config/oauth2.js');
// Require models
const models = require("../models/index.js")['default'];
// Require other services
const { validateRequest } = require("../utils/validationService.js");
const {
    initialResponseParameters, 
    getLogData, 
    errorLog, 
    responseStructure, 
} = require("../utils/utilityService.js");
const {is_null} = require("locutus/php/var");
const empty = require("locutus/php/var/empty");

/**
 * Register Client
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.registerClient = async (req, res) => {
    // Get initial response parameters
    let [responseData, statusValue, error] = initialResponseParameters();
    let responseMessage;
    // Validate request parameters
    const [passed, validationResponse] = await validateRequest(req,
        {
            'name': 'required|string|minLength:5',
            'username' : 'required|string|minLength:5',
            'password': 'required|string|minLength:6|alphaNumeric',
        }, res);

    if (!passed) {
        return res.send(validationResponse);
    }

    // Try block
    try {
        // Get request data
        const data = req.body;

        // Try to check if this info already exists
        const clientRecord = await models.Client.findOne({
            username: data.username
        }).exec();

        if (!is_null(clientRecord) && !empty(clientRecord)) {

            responseMessage = "Client with supplied information already exists!";

        } else {
            
            data.created_at = new Date();
            data.updated_at = new Date();
            // Create record
            await models.Client.create(data);

            responseData = data;
            responseMessage = "Query ok!";
            statusValue = true;
        }


    } catch (e) {
        responseMessage = "An error occurred";
        error = errorLog(e);
    }

    let response = responseStructure(responseMessage, statusValue, responseData);
    write_logs(getLogData(req, error ? error : response, 'register Client'));
    // send back response
    res.send(response);
}


/**
 * Get Client token
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getClientToken = async (req, res) => {
    // Get initial response parameters
    let [responseData, statusValue, error] = initialResponseParameters();
    let responseMessage;
    // Validate request parameters
    const [passed, validationResponse] = await validateRequest(req,
        {'username': 'required', 'password': 'required'},
        res);
    if (!passed) {
        return res.send(validationResponse);
    }

    // Try block
    try {
       // Generate Client bearer token
        let client = await models.Client.findOne({username: req.body.username}).exec();

        if (is_null(client)) {
            responseMessage = "Invalid credentials supplied.";
        } else {
            // Verify supplied credentials with password
            let valid = client.verifyPasswordSync(req.body.password);
            if (valid) {
                // Proceed to issue token
                const token = await generateAccessToken(client);
                responseData = {
                    'access_token' : token,
                    'token_type': 'Bearer',
                    'client': {
                        username: client.username,
                        name: client.name,
                    }
                };
                responseMessage = "Login successfully";
                statusValue = true;

            } else {

                responseMessage = "Client not found!";
            }
        }


    } catch (e) {
        responseMessage = "An error occurred";
        error = errorLog(e);
    }

    let response = responseStructure(responseMessage, statusValue, responseData);
    write_logs(getLogData(req, error ? error : response, 'get client token'));
    // send back response
    res.send(response);
}
