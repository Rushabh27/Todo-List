const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  name: String,
  done: Boolean,
  detail: String,
  dueDate: Date,
  priority: Number,
  UserId: String
});
module.exports = Todo = mongoose.model("todo", todoSchema);
