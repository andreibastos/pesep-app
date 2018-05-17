// server.js
const express = require('express');
const app = express();
const path = require('path');

const forceSSL = function() {
    return function (req, res, next) {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(
         ['https://', req.get('Host'), req.url].join('')
        );
      }
      next();
    }
  }
  // Instruct the app
  // to use the forceSSL
  // middleware
  // app.use(forceSSL());

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));
// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);

app.get('/*', function(req, res) {
	var file = path.join(__dirname + '/dist/index.html')
    res.sendFile(file);
    console.log(file)
  });

console.log("apps works!")

// console.log("http://localhost:8080")