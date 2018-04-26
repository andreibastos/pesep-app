
//Install express server
const express = require('express');
const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/browser'));

port = process.env.PORT || 8080
// Start the app by listening on the default Heroku port
app.listen(port);

console.log("server start port: " +port )