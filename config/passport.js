const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
// Include user model
const User = require("../models/user");

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true
      },
      (req, email, password, done) => {
        User.findOne({ where: { email: email } }).then(async user => {
          if (!user) {
            return done(
              null,
              false,
              req.flash(
                "warning",
                "This email is not registered. Please Register Yourself."
              )
            );
          }
          // use bcrypt to check password correction
          const isMatched = await bcrypt.compare(password, user.password);
          console.log(isMatched);
          if (!isMatched) {
            return done(
              null,
              false,
              req.flash("warning", "Email or password incorrect")
            );
          }
          // if password matched
          return done(null, user);
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.find({ id: id }).then(user => done(null, user));
  });
};
