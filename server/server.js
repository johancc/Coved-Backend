/*
|--------------------------------------------------------------------------
| server.js -- The core of your server
|--------------------------------------------------------------------------
|
| This file defines how your server starts up. Think of it as the main() of your server.
| At a high level, this file does the following things:
| - Connect to the database
| - Sets up server middleware (i.e. addons that enable things like json parsing, user login)
| - Hooks up all the backend routes specified in api.js
| - Forwards frontend routes that should be handled by the React router
| - Sets up error handling in case something goes wrong when handling a request
| - Actually starts the webserver
*/

// validator runs some basic checks to make sure you've set everything up correctly
// this is a tool provided by staff, so you don't need to worry about it
const validator = require("./validator");
validator.checkSetup();
// environmental variables
require("dotenv").config()

//import libraries needed for the webserver to work!
const http = require("http");
const express = require("express"); // backend framework for our node server.
const session = require("express-session"); // library that stores info about each connected user
const mongoose = require("mongoose"); // library to connect to MongoDB
const compression = require("compression");
const firebase = require("firebase-admin");
const fs = require("fs"); // I/O
const path = require("path"); // provide utilities for working with file and directory paths
const api = require("./api"); 
const cron = require("node-cron"); // Needed to send periodic emails

const Mentee = require("./models/mentee");
const sendEmail = require("./sendEmail");

// initialize firebase admin
const firebaseConfigPath = path.join(__dirname, '..','/google-credentials-heroku.json');

const googleServiceAccount = JSON.parse(fs.readFileSync(firebaseConfigPath));

if (!googleServiceAccount) {
  throw new Error('Cannot find google service account credentials.');
}

firebase.initializeApp({
  credential: firebase.credential.cert(googleServiceAccount),
  databaseURL: "https://coveducation-13eda.firebaseio.com"
});

// Server configuration below

const mongoConnectionURL = process.env.MONGO_URI;
const databaseName = "Coved-Tutor-Test";

// connect to mongodb
mongoose
  .connect(mongoConnectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: databaseName,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`Error connecting to MongoDB: ${err}`));

// create a new express server
const app = express();
app.use(validator.checkRoutes);
app.use(compression());
// allow us to process POST requests
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}
// set up a session, which will persist login data across requests
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);


// connect user-defined routes
app.use("/api", api);

// Every 3 hours send an email to parents who 
// have verified their email >= 3 days ago and not
// been sent a privacy reminder email.
cron.schedule('0 0 */3 * * *', () => {
  const millis_in_a_day = 1000 * 60 * 60 * 24;
  Mentee.find({}).then((mentees) => mentees.map((mentee) => {
    firebase.auth().getUser(mentee.firebase_uid).then((user) => {
      // We need the firebase record to check if they're validated
      const is_verified = user.emailVerified;
      const verified_date = mentee.verified_date;
      const reminder_sent = mentee.reminder_sent;
      if (reminder_sent) {
        return;
      } else if (verified_date === undefined && is_verified) {
        // If we don't know when they verified, assign it and move on.
        mentee.verified_date = Date.now()
        return mentee.save();
      } else if (is_verified && ((Date.now() - verified_date) / (millis_in_a_day)) > 3) {
        // More than three days since verication, send reminder.
        sendEmail.sendPrivacyReminderEmail(mentee.email);
        mentee.reminder_sent = true;
        return mentee.save();
      };
    });
  })
  );
});

// load the compiled react files, which will serve /index.html and /bundle.js
const reactPath = path.resolve(__dirname, "..", "client", "dist");
app.use(express.static(reactPath));

// for all other routes, render index.html and let react router handle it
app.get("*", (req, res) => {
  res.sendFile(path.join(reactPath, "index.html"));
});

// any server errors cause this function to run
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) {
    // 500 means Internal Server Error
    console.log("The server errored when processing a request!");
    console.log(err);
  }

  res.status(status);
  res.send({
    status: status,
    message: err.message,
  });
});


// hardcode port to 3000
const port = process.env.PORT || 3000;
const server = http.Server(app);

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});