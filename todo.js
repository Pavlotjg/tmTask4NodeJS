const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  name: String,
  description: {type: String, default: ''},
  isDone: {type: Boolean, default: false}
});
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
