module.exports = {
    createTodoRules: {
        title: 'required|string|minLength:5',
        description: 'required|string|maxLength:50|minLength:6',
        due_date: 'required|date',
    },
    updateTodoRules: {
        id: 'required',
    },
}