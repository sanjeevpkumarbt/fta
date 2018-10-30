var express = require('express');
var app = express();
var fs = require('fs');
var dbconn;

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
var cert = fs.readFileSync("/keys/client.pem");
var key = fs.readFileSync("/keys/client.pem");

// User name
var userName = encodeURIComponent("CN=node01.trznt.com,OU=IT,O=trznt,L=Bangalore,ST=Karnataka,C=IN");

// Connect using X509 authentication
function openDB() {
    MongoClient.connect(f('mongodb://%s@%s:27017/test?ssl=true', userName,process.env.DBSERVER), {
    server: {
        sslKey:key
      , sslCert:cert
      , sslValidate:false
    }
  }, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to DB server: " + process.env.DBSERVER);

    dbconn = db;
  });
}

setTimeout(openDB,4000);
