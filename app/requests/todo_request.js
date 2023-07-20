module.exports = {
    createTodoRules: {
        user_id: 'required',
        title: 'required|string|minLength:5',
        description: 'required|string|maxLength:50|minLength:6',
        due_date: 'required|datetime',
    },
    updateTodoRules: {
        id: 'required',
        user_id: 'required'
    },
}