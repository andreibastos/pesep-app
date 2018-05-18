// server.js
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();

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


//servidor
// default options
app.use(fileUpload());
app.post('/read_file', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  console.log( req.files);
  res.send({"files":req.files})
  

 
});

app.get('/*', function(req, res) {
	var file = path.join(__dirname + '/dist/index.html')
    res.sendFile(file);
    console.log(file)
  });

console.log("apps works!")


// console.log("http://localhost:8080")