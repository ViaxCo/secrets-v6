const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models");

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      // callbackURL: "http://localhost:3000/auth/google/secrets",
      callbackURL: process.env.CALLBACK_URL,
      scope: "profile",
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOrCreate({ googleId: profile.id }, (err, user) => {
        return cb(err, user);
      });
    }
  )
);

// @desc GET router.route("/")
exports.getHome = (req, res) => {
  res.render("home");
};

// @desc GET router.route("/auth/google")
exports.getGoogleAuth = passport.authenticate("google", { scope: ["profile"] });

// @desc GET router.route("/auth/google/secrets")
exports.getGoogleAuthCallback = (req, res, next) =>
  passport.authenticate("google", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })(req, res, next);

// @desc GET router.route("/register")
exports.getRegister = (req, res) => {
  res.render("register");
};

// @desc GET router.route("/login")
exports.getLogin = (req, res) => {
  res.render("login");
};

// @desc GET router.route("/secrets")
exports.getSecrets = (req, res) => {
  const authenticatedStatus = req.isAuthenticated();
  const currentUser = req.user;
  // Find all the secrets submitted that are not equal to "empty"
  User.find({ secret: { $ne: [] } }, (err, users) => {
    if (err) return console.log(err.message);
    if (users) {
      res.render("secrets", {
        usersWithSecrets: users,
        authenticatedStatus,
        currentUser,
      });
    }
  });
};

// @desc GET router.route("/logout")
exports.getLogout = (req, res) => {
  req.logout();
  res.redirect("/");
};

// @desc GET router.route("/submit")
exports.getSubmitPage = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
};

// @desc POST router.route("/register")
exports.registerUser = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.register({ email }, password, (err, user) => {
    if (err) {
      console.log(err.message);
      res.redirect("/register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/secrets");
    });
  });
};

// @desc POST router.route("/login")
exports.loginUser = (req, res, next) =>
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })(req, res, next);

// @desc POST router.route("/submit")
exports.submitSecret = (req, res) => {
  const secret = req.body.secret;
  const userId = req.user._id;

  User.findById(userId, async (err, user) => {
    if (err) return console.log(err.message);
    if (user) {
      if (secret !== "") {
        user.secret.push(secret);
      } else {
        return res.redirect("/submit");
      }
      user.save((err) => {
        if (err) return console.log(err.message);
        res.redirect("/secrets");
      });
    } else {
      res.redirect("/login");
    }
  });
};

// @desc POST router.route("/delete/:index")
exports.deleteSecret = (req, res) => {
  const index = req.params.index;
  const currentUser = req.user;

  User.findById(currentUser._id, (err, user) => {
    user.secret.splice(index, 1);
    user.save((err) => {
      if (err) return console.log(err.message);
      res.redirect("/secrets");
    });
  });
};
