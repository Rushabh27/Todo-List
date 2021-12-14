// app.js
const express = require("express");
const app = express();
const flash = require("connect-flash");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
//const csrf = require("csurf");
const methodOverride = require("method-override");
const userRoutes = require("./routes/user");
const todoRoutes = require("./routes/todo");
const homeRoutes = require("./routes/home");
const searchRoutes = require("./routes/search");
const passport = require("passport");
const session = require("express-session");
const errorController = require("./controllers/error");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Todo-List", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const port = 8081;

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// setup session
app.use(
  session({
    secret: "kldxnflkdzsfrf",
    resave: "false",
    saveUninitialized: "false"
  })
);

// set up passport
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

// set up connect-flash
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.reminder = req.flash("reminder");
  res.locals.warning = req.flash("warning");
  res.locals.success = req.flash("success");
  next();
});

app.use(express.static("public"));

app.use("/todos", todoRoutes);

app.use("/users", userRoutes);

app.use("/search", searchRoutes);

app.use("/", homeRoutes);

app.use(errorController.getError);

app.listen(port, () => {
  console.log(`App is running on port ${port}!`);
});
