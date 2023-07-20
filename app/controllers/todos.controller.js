// Require logger
const write_logs = require("../utils/loggerService.js");
// Require models
const models = require("../models/index.js")['default'];
// Require other services
const { validateRequest } = require("../utils/validationService.js");
const {initialResponseParameters, getLogData, errorLog, responseStructure} = require("../utils/utilityService.js");
const {is_null} = require("locutus/php/var");
const { createTodoRules, updateTodoRules } = require("../requests/todo_request.js");
const isset = require("locutus/php/var/isset");

/**
 * Get all todos
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getAllTodos = async (req, res) => {
    // Get initial response parameters
    let [responseData, statusValue, error] = initialResponseParameters();
    let responseMessage;
    // Validate request parameters
    const [passed, validationResponse] = await validateRequest(req, {'user_id': 'required'}, res, 'query');
    if (!passed) {
        return res.send(validationResponse);
    }
    // Get auth user
    const authUser = res.locals.user;

    // Try block
    try {

        let results = [];
        let todos = await models.Todo.find({user_id: req.query.user_id}).exec();
        todos.forEach((element, index) => {
            results.push({
                title: element.title,
                description: element.description,
                due_date: element.due_date,
                id: element._id,
                status: element.status,
                created_at: element.created_at
            });
        });
        // return success
        responseData = results;
        responseMessage = "Query ok!";
        statusValue = true;

    } catch (e) {
        responseMessage = "An error occurred";
        error = errorLog(e);
    }

    let response = responseStructure(responseMessage, statusValue, responseData);
    write_logs(getLogData(req, error ? error : response, 'get all todos'));

    // send back response
    res.send(response);
}


/**
 * Get single todo
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getSingleTodo = async (req, res) => {
    // Get initial response parameters
    let [responseData, statusValue, error] = initialResponseParameters();
    let responseMessage;
    // Validate request parameters
    const [passed, validationResponse] = await validateRequest(req, {'id': 'required'}, res, 'query');
    if (!passed) {
        return res.send(validationResponse);
    }
    // Get auth user
    const authUser = res.locals.user;

    // Try block
    try {
        const query = req.query;
        const todo = await models.Todo.findOne({_id: query.id}).exec();

        if (is_null(todo)) {

            responseMessage = "Todo not found";

        } else {
            responseData = {
                id: todo._id,
                title: todo.title,
                description: todo.description,
                status: todo.status,
                due_date: todo.due_date,
                created_at: todo.created_at
            };
            // return success
            responseMessage = "Query ok!";
            statusValue = true;
        }
        

    } catch (e) {
        responseMessage = "An error occurred";
        error = errorLog(e);
    }

    let response = responseStructure(responseMessage, statusValue, responseData);
    write_logs(getLogData(req, error ? error : response, 'get single todo'));

    // send back response
    res.send(response);
}

/**
 * Create todo
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.createTodo = async (req, res) => {
    // Get initial response parameters
    let [responseData, statusValue, error] = initialResponseParameters();
    let responseMessage;
    // Validate request parameters
    const [passed, validationResponse] = await validateRequest(req, createTodoRules, res);
    if (!passed) {
        return res.send(validationResponse);
    }
    // Get auth user
    const authUser = res.locals.user;

    // Try block
    try {

        const data = req.body;
        const exists = await models.Todo.findOne({title: data.title}).exec();

        if (exists) {
            responseMessage = "Todo already exist!";

        } else {
            data.status = "PENDING";
            await models.Todo.create(data);
            responseMessage = "Todo created successfully!";
            statusValue = true;
        }

    } catch (e) {
        responseMessage = "An error occurred";
        error = errorLog(e);
    }

    let response = responseStructure(responseMessage, statusValue, responseData);
    write_logs(getLogData(req, error ? error : response, 'create todo'));

    // send back response
    res.send(response);
}


/**
 * Update todo
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.updateTodo = async (req, res) => {
    // Get initial response parameters
    let [responseData, statusValue, error] = initialResponseParameters();
    let responseMessage;
    // Validate request parameters
    const [passed, validationResponse] = await validateRequest(req, updateTodoRules, res);
    if (!passed) {
        return res.send(validationResponse);
    }
    // Get auth user
    const authUser = res.locals.user;

    // Try block
    try {
        const data = req.body;

        const todo = await models.Todo.findOne({_id: data.id});
        if (is_null(todo)) {
            responseMessage = "Todo does not exist";

        } else {
            // If status update is set, check that the status is valid
            const allowedStatus = ["PENDING", "IN PROGRESS", "COMPLETED"];
            if (isset(data.status)) {
                if (allowedStatus.indexOf(data.status) === -1) {
                    responseMessage = "Status is invalid. Must be one of " + allowedStatus.join(", ");
                    let response = responseStructure(responseMessage, statusValue, responseData);
                    write_logs(getLogData(req, error ? error : response, 'update todo'));
                    // send back response
                    return res.send(response);
                }
            }

            delete data.id;
            await models.Todo.findOneAndUpdate({_id: todo._id, user_id: data.user_id}, data);
            responseMessage = "Todo updated successfully!";
            statusValue = true;
        }

    } catch (e) {
        responseMessage = "An error occurred";
        error = errorLog(e);
    }

    let response = responseStructure(responseMessage, statusValue, responseData);
    write_logs(getLogData(req, error ? error : response, 'update todo'));
    // send back response
    res.send(response);
}

/**
 * Delete todo
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.deleteTodo = async (req, res) => {
    // Get initial response parameters
    let [responseData, statusValue, error] = initialResponseParameters();
    let responseMessage;
    // Validate request parameters
    const [passed, validationResponse] = await validateRequest(req, {
        'id' : 'required', 'user_id': 'required',
    }, res);

    if (!passed) {
        return res.send(validationResponse);
    }
    // Get auth user
    const authUser = res.locals.user;

    // Try block
    try {
        const data = req.body;
        const todo = await models.Todo.findOne({_id: data.id, user_id: data.user_id});

        if (is_null(todo)) {
            responseMessage = "Todo does not exist";

        } else {
            await todo.deleteOne({_id: data.id});
            responseMessage = "Todo deleted successfully!";
            statusValue = true;
        }

    } catch (e) {
        responseMessage = "An error occurred";
        error = errorLog(e);
    }

    let response = responseStructure(responseMessage, statusValue, responseData);
    write_logs(getLogData(req, error ? error : response, 'delete todo'));
    // send back response
    res.send(response);
}