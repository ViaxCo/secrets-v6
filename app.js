require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const { connectDB, connection } = require("./config/db");

const app = express();
connectDB();

app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false, //don't save session if unmodified
    saveUninitialized: false, // don't create session until something is stored
    // cookie: { secure: true }, // requires an https-enabled website, for secure cookies
    store: new MongoStore({
      mongooseConnection: connection,
      // ttl: 14 * 24 * 60 * 60, // = 14 days.
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/", require("./routes"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
