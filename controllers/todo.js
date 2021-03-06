const { body, validationResult } = require("express-validator");
const Todo = require("../models/todo");
// Include date converter
const { convertDate } = require("../date-converter");

module.exports = {
  getViewAllTodo: (req, res) => {
    res.redirect("/");
  },
  getViewOneTodo: (req, res) => {
    Todo.findOne({
      where: {
        UserId: req.session.UserId,
        Id: req.params.id
      }
    })
      .then(todo => {
        todo.dueDate = convertDate(todo.dueDate);
        res.render("detail", { todo, detailCSS: true });
      })
      .catch(error => console.log(error));
  },
  getNewTodo: (req, res) => {
    res.render("new", {
      todoFormCSS: true,
      formValidation: true,
      todo: { notDone: true }
    });
  },
  postNewTodo: (req, res) => {
    // keep user input
    const { name, status, detail, dueDate, priority } = req.body;
    const UserId = req.session.UserId;
    console.log(UserId);
    // retrieve error message from express-validator
    const errors = validationResult(req);
    // one or more error messages exist
    if (!errors.isEmpty()) {
      return res.status(422).render("new", {
        todoFormCSS: true,
        formValidation: true,
        warning: errors.array(),
        todo: {
          name,
          done: status === "done",
          notDone: status === "notDone" || !status,
          detail,
          dueDate,
          priority,
          UserId
        }
      });
    }

    // pass validation
    Todo.create({
      name,
      done: req.body.status === "done",
      detail,
      dueDate,
      priority,
      UserId
    })
      .then(todo => res.redirect("/"))
      .catch(error => res.status(422).json(err));
  },
  getEditTodo: (req, res) => {
    Todo.findOne({
      where: {
        Id: req.params.id,
        UserId: req.session.UserId
      }
    }).then(todo => {
      todo.dueDate = convertDate(todo.dueDate);
      return res.render("edit", {
        todo,
        todoFormCSS: true,
        formValidation: true
      });
    });
  },
  putEditTodo: (req, res) => {
    // keep user input
    const { id, name, status, detail, dueDate, priority } = req.body;
    // retrieve error message from express-validator
    const errors = validationResult(req);
    // one or more error messages exist
    if (!errors.isEmpty()) {
      return res.status(422).render("edit", {
        todoFormCSS: true,
        formValidation: true,
        warning: errors.array(),
        todo: {
          id,
          name,
          done: status === "done",
          notDone: status === "notDone" || !status,
          detail,
          dueDate,
          priority
        }
      });
    }
    // pass validation
    Todo.findOne({
      where: {
        Id: req.params.id,
        UserId: req.session.UserId
      }
    })
      .then(todo => {
        todo.name = name;
        todo.done = req.body.status === "done";
        todo.detail = detail;
        todo.dueDate = dueDate;
        todo.priority = priority;
        return todo.save();
      })
      // .then(todo => res.redirect(`/todos/edit/${req.params.id}`))
      .then(todo => res.redirect(`/`))
      .catch(error => console.log(error));
  },
  deleteTodo: (req, res) => {
    Todo.remove({
      where: {
        UserId: req.session.UserId,
        Id: req.params.id
      }
    })
      .then(todo => res.redirect("/"))
      .catch(error => res.status(422).json(error));
  }
};
