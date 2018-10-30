var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.static('html/public'));

app.get('/',function(req,res){
  res.sendFile(__dirname + "/html/index.html");
})

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server is listening at http://%s:%s", host, port);
});


var MongoClient = require('mongodb').MongoClient,
  f = require('util').format,
  assert = require('assert');

// Read the cert and key
var cert = fs.readFileSync("/home/kumarsp2/keys/client.pem");
var key = fs.readFileSync("/home/kumarsp2/keys/client.pem");

// User name
var userName = encodeURIComponent("CN=kumarsp2-VirtualBox,OU=IT,O=trznt,L=Bangalore,ST=Karnataka,C=IN");

// Connect using X509 authentication
MongoClient.connect(f('mongodb://%s@kumarsp2-VirtualBox:27017/test?ssl=true', userName), {
  server: {
      sslKey:key
    , sslCert:cert
    , sslValidate:false
  }
}, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  db.close();
});
