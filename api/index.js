const starttupDebugger = require('debug')('app:startup');
require('./startup/folders')();
const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const morgan = require("morgan")

// hook morganBody to express app
app.use(morgan('combined'));
morgan(app, { logAllReqHeader: true, maxBodyLength: 5000 });

require('./startup/routes')(app);
require('./startup/db')();

const port = process.env.PORT || 3000;
const server = app.listen(port, "0.0.0.0", true, () => console.log(`Listening on port ${port}...`));
// const server = https.createServer({
//     key: fs.readFileSync('selfsigned.key'),
//     cert: fs.readFileSync('selfsigned.pem'),
//     enableTrace: true
// }, app).listen(port, "0.0.0.0", () => console.log(`Listening on port ${port}...`));

module.exports = server;