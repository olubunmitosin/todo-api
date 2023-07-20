const { Validator } = require("node-input-validator");
const write_logs = require("./loggerService");
const { responseStructure, getLogData } = require("./utilityService");


module.exports = {
    /**
     * Validate Request
     * @param req
     * @param rules
     * @param res
     * @param type
     * @returns {Promise<(boolean|{response: null, message, status: boolean})[]>}
     */
    async validateRequest(req, rules, res, type = 'body') {
        let validator;
        if (type === 'body') {
            validator = new Validator(req.body, rules);
        } else {
            validator = new Validator(req.query, rules);
        }

        const validationPassed = await validator.check();

        if (!validationPassed) {
            let response = responseStructure("Validation not pass", false, validator.errors);
            write_logs(getLogData(req, response, 'Validation failed'));
            return [false, response]
        }

        return [true, {}];
    },
}