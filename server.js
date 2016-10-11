var express = require('express');

// Create our app
var app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.listen(PORT, function () {
  console.log('Express server is up on port ' + PORT);
});