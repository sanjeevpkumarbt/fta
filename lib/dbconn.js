const DB_MAX_TRIES = 5;

var fs = require('fs');
var MongoClient = require('mongodb').MongoClient,
  f = require('util').format,
  assert = require('assert');


  // Read the cert and key
var cert = fs.readFileSync(process.env.KEYS + "/client.pem");
var key = fs.readFileSync(process.env.KEYS + "/client.pem");

var userName = encodeURIComponent("CN=node01.trznt.com,OU=IT,O=trznt,L=Bangalore,ST=Karnataka,C=IN");

function _openDB(tries,callback) {
    MongoClient.connect(f('mongodb://%s@%s:27017/test?ssl=true', userName,process.env.DBSERVER), {
    server: {
        sslKey:key
      , sslCert:cert
      , sslValidate:false
    }
  }, function(err, db) {
    if (err) {
      if (tries >= DB_MAX_TRIES) {
        return callback && callback(err,null);
      }
      console.log("DB not open.. retrying");
      return setTimeout(_openDB,10000,tries + 1, callback);
    }
    callback(null,db);
  })
}

module.exports = {
  openDB: function (tries,callback) {
    _openDB(0,callback);
  }
}
