const Todo = require("../models/todo");

module.exports = {
  getSearch: (req, res) => {
    // retrieve data user selected
    console.log(req.query, new Date().toLocaleDateString());
    const sortedFilter = req.query.sort;
    const date = new Date().toISOString().slice(0, 10);

    var user = { UserId: req.session.UserId };
    // Filter option for all unique date
    if (sortedFilter != "") {
      if (sortedFilter == "Upcoming Tasks") {
        user["dueDate"] = { $gt: new Date() };
      }
      if (sortedFilter == "Today's Tasks") {
        user["dueDate"] = {
          $gte: date + "T00:00:00",
          $lte: date + "T23:59:59"
        };
      }
      if (sortedFilter == "Overdue Tasks") {
        user["dueDate"] = { $lt: new Date() };
      }
      Todo.find(user)
        .then(todos => {
          return res.render("index", {
            todos,
            indexCSS: true,
            noTask: todos.length === 0,
            hasAnimation: true,
            filter: {
              sort: sortedFilter
            }
          });
        })
        .catch(error => console.log(error));
    }
  }
};
