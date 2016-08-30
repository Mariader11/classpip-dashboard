var express = require('express')
var app = express()

app.get('/', function(req, res) {
  res.status(200).send('admin.classpip.com\n')
})

app.listen(8080, function() {
  console.log('App listening at localhost:8080')
})
