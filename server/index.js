// Dependencies
// =============================================================
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const compression = require('compression');
const logger = require("morgan");
const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv');
const routes = require("./routes");

dotenv.config();

const PORT = process.env.PORT || 3000;

// Setup Express App
// =============================================================
const app = express();

// Setup view engine
// ==============================================================
app.set('port', PORT);
app.set('view engine', 'pug');
app.set('views', './client/pug');

// Use Morgan to log requests
let accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {"flags": "a"});

//  Set Morgan to output to access.log file and to console
app.use(logger("common", {"stream": accessLogStream}));
app.use(logger("dev"));

// Use bodyParser middleware to parse strings
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// To Read Cookies
app.use(cookieParser());

// Add Routes
// =============================================================
app.use(compression());
app.use('/static', express.static('./static'));

app.use('/', routes);

// Start Express
// =============================================================
// Syncing DB & Start Express (!!!Force Must Be Set To False Or It Will Overwrite Data!!!)
// =============================================================
http.createServer(app).listen(PORT, function() {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
