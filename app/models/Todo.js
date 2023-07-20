'use strict';
module.exports = mongoose => {
  const newSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    due_date: {
      type: Date,
      default: Date.now()
    }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });
  const Todo = mongoose.model('Todo', newSchema);
  return Todo;
};