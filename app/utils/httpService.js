const axios = require('axios');
const {empty, isset} = require("locutus/php/var");

module.exports = {

    /**
     * Make Get Request Call
     * @param type
     * @param url
     * @param data
     * @param headers
     * @returns {Promise<{resp: *, success: boolean} | {success: boolean, error}>}
     */
    getRequest(type, url, data = {}, headers = {}) {
        // Define options
        let options = {};

        // If get has query data or params, assign this to the options too
        if (!empty(data)) {
            options.params = data;
        }

        // If this has headers that should be passed, attach the headers too
        if (!empty(headers)) {
            options.headers = headers;
        }

        // Make request call using Axios library
        return axios.get(url, options).then((resp) => {
            if (resp.data.status) {
                return {'success': true, 'resp' : resp.data};
            }
            return {'success': false, 'resp' : resp.data};
        }).catch((error) => {
            // console.log(error);
            return {'success': false, 'error' : error.message || 'Unknown error occurred'}
        });
    },


    /**
     * Make Post Request call
     * @param type
     * @param url
     * @param data
     * @param headers
     * @returns {Promise<{resp: *, success: boolean} | {success: boolean, error}>}
     */
    postRequest(type, url, data, headers = {}) {
        // Define options
        let options = {};

        // If this has headers that should be passed, attach the headers too
        if (!empty(headers)) {
            options.headers = headers;
        }

        // Make request call using Axios library
        return axios.post(url, data, options).then((resp) => {
            if (resp.data.status) {
                return {'success': true, 'resp' : resp.data};
            }
            return {'success': false, 'resp' : resp.data};

        }).catch((error) => {
            let message = 'Unknown error occurred';
            if (isset(error.response) && isset(error.response.data) && isset(error.response.data.message)) {
                message = error.response.data.message;
            } else if (isset(error.message)) {
                message = error.message;
            }
            // return error response
            return {'success': false, 'error' : message}
        });
    }
}