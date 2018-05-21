// server.js
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const  app = express();

const forceSSL = function () {
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


//servidor
// default options
app.use(express.json());
app.post('/read_file', function (req, res) {

  console.log(req.body);
  res.send(req.body);

});

app.get('/*', function(req, res) {
	var file = path.join(__dirname + '/dist/index.html')
    res.sendFile(file);
    console.log(file)
  });

console.log("apps works!")


// console.log("http://localhost:8080")