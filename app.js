var express = require('express');
var app = express();

app.use(express.static('html/public'));

app.get('/',function(req,res){
  res.sendFile(__dirname + "/html/index.html");
})

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server is listening at http://%s:%s", host, port);
});
