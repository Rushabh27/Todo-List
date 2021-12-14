const Todo = require("../models/todo");
const { convertDate } = require("../date-converter");

module.exports = {
  getHome: (req, res) => {
    req.session.UserId = req.user[0].email;
    Todo.find({
      UserId: req.session.UserId
    })
      .sort({ priority: -1 })
      .then(todos => {
        // Filter option for all unique date
        const dateOptions = [];
        if (todos.length > 0) {
          todos.forEach(todo => {
            // convert date
            const convertedDate = convertDate(todo.dueDate);
            // Add unique date to date filter
            if (!dateOptions.includes(convertedDate)) {
              dateOptions.push(convertedDate);
            }
            // convert all displayed date
            todo.dueDate = convertedDate;
          });
        }
        res.render("index", {
          todos,
          indexCSS: true,
          dateOptions,
          noTask: todos.length === 0,
          hasAnimation: true
        });
      });
  }
};
