const { array_filter } = require("locutus/php/array");
const { trim, str_replace, strtolower, strlen} = require("locutus/php/strings");
const { RegisteredUserOtp } = require("../models/index.js");
const {is_null} = require("locutus/php/var");
const moment = require("moment");
const path = require("path");

module.exports = {

    /**
     * Convert array keys to snake_case
     * @param arrayItems
     * @returns {*[]}
     */
    indexToLower (arrayItems) {
        // Define the holder
        let result = [];

        // remove empty of null objects/elements from the arrayItems
        arrayItems = array_filter(arrayItems);
        arrayItems.forEach((item, index) => {
            result[index.toLowerCase().replace(' ', '_')] = item.length < 0 ? null : item;
        });

        return result;
    },

    /**
     * Get array that follows API response data format for this project
     * @param message
     * @param status
     * @param data
     * @returns {{response: null, message, status: boolean}}
     */
    responseStructure (message, status = true, data = null) {
        return {
            status: status,
            response: data,
            message: message,
        }
    },


    /**
     * Generate random integer
     * @param length
     * @returns {number}
     */
    randInt(length) {
        return (Math.random() * Math.pow(10, length - 1) + Math.pow(10, length -1) );
    },

    getExtension(filename) {
        let ext = path.extname(filename||'').split('.');
        return ext[ext.length - 1];
    },

    /**
     * Generate random string
     * @param length
     * @returns {string}
     */
    generateRandomString (length) {
        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let charactersLength = strlen(characters);

        let randomString = '';
        for (let i = 0; i < length; i++) {
            let char = characters[Math.floor((Math.random() * charactersLength - 1))];
            if (char && typeof char !== "undefined") {
                randomString += characters[Math.floor((Math.random() * charactersLength - 1))];
            } else {
                length++;
            }
        }
        return randomString;
    },


    /**
     * Build a structured log data
     * @param req
     * @param resp
     * @param serviceName
     * @param extra
     */
    getLogData(req, resp, serviceName, extra = null) {
        let logData = {};
        //logData['header'] = req.rawHeaders;
        // remove the auth token from the log data
        if (logData['authorization']) {
            delete logData['authorization'];
        }
        logData['method'] = req.method;
        logData['url'] = req.originalUrl;
        logData['_Service'] = serviceName;
        logData['Request'] = {'time': new Date(), 'params': req.params, 'query': req.query};
        logData['Response'] = {'time': new Date(), 'data': resp};
        logData['extra'] = extra;
        return logData;
    },

    /**
     * Get error log
     * @param e
     * @returns {{exception: string, msg, file: *, line: *}}
     */
    errorLog(e) {
        console.log(e);
        return {
            'exception': '---------------------------->',
            'msg': e.message,
            //'file': e.stack,
        }
    },

    // Generate initial response parameters
    initialResponseParameters() {
        let responseData, error, statusValue;
        responseData = error = null;
        statusValue = false;

        return [responseData, statusValue, error];
    },

    /**
     *
     * @param page
     * @param size
     * @returns {{offset: (number|number), limit: (number|number)}}
     */
    getPagination(page, size){
        const limit = size ? +size : 10;
        const offset = page ? (page - 1) * limit : 0;
        return { limit, offset };
    },

    /**
     *
     * @param data
     * @param page
     * @param limit
     * @returns {{totalItems, tutorials, totalPages: number, currentPage: (number|number)}}
     */
    getPagingData(data, page, limit) {
        const { count: totalItems, rows: items } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);

        return { totalItems, items, totalPages, currentPage };
    },


    /**
     * Convert string to slug
     * @param nameString
     * @returns {string}
     */
    convertToSlug (nameString) {
        // Check if this is actually a string
        if (typeof nameString === "string") {
            nameString = str_replace(' ','', strtolower(nameString)) // Replaces all spaces with hyphens.
            nameString = str_replace(' ','', strtolower(nameString)) // Replaces all spaces with hyphens.
            nameString = nameString.preg_replace('/[^A-Za-z0-9\-]/', '') // Removes special chars.

            nameString = nameString.preg_replace('/-+/', '-') // Replaces multiple hyphens with single one.

            return trim(nameString);
        }

        return trim(nameString);
    }
}