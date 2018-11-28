const DB_MAX_TRIES = 5;

var fs = require('fs');
var MongoClient = require('mongodb').MongoClient,
  f = require('util').format,
  assert = require('assert');


  // Read the cert and key
var ca = fs.readFileSync(process.env.KEYS + "/caroot.cer");
var cert = fs.readFileSync(process.env.KEYS + "/node01.pem");
var key = fs.readFileSync(process.env.KEYS + "/node01.pem");

//var userName = encodeURIComponent("emailAddress=sanjeev@trznt.com,CN=node01.trznt.com,OU=IT,O=trznt,L=Bangalore,ST=Karnataka,C=IN");
var userName = "emailAddress=sanjeev.p.kumar@bt.com,ST=Karnataka,OU=IT,L=Bangalore,O=Openreach,C=IN,CN=node01.trznt.com";


function _openDB(tries,callback) {
    if (process.env.MONGODB_SVC_A_SERVICE_HOST) {
      var db01 = "mongo01.trznt.com";
      var db02 = "mongo02.trznt.com";
      var db03 = "mongo03.trznt.com";
      var dbs = db01 + ":27017," + db02 + ":27017," + db03 + ":27017";
      console.log("Connecting to: " + 'mongodb://%s@%s/test?replicaSet=my_set&authMechanism=%s&ssl=true', userName, db01 + ":27017," + db02 + ":27017," + db03 + ":27017");
      MongoClient.connect(f('mongodb://%s@%s/test?authMechanism=%s&replicaSet=my_set&ssl=true', encodeURIComponent(userName),dbs,'MONGODB-X509'), {
          useNewUrlParser: true
        , sslCA:ca
        , sslKey:key
        , sslCert:cert
        , sslValidate:true
    }, function(err, db) {
      if (err) {
        if (tries >= DB_MAX_TRIES) {
          return callback && callback(err,null);
        }
        console.log("DB: " + process.env.DBSERVER + " not open.. retrying");
        return setTimeout(_openDB,10000,tries + 1, callback);
      }
      callback(null,db);
    })
  } else {
    MongoClient.connect(f('mongodb://%s@%s:27017/test?authMechanism=%s&ssl=true', encodeURIComponent(userName),process.env.DBSERVER,'MONGODB-X509'), {
        useNewUrlParser: true
      , sslCA:ca
      , sslKey:key
      , sslCert:cert
      , sslValidate:true
  }, function(err, db) {
    if (err) {
      if (tries >= DB_MAX_TRIES) {
        return callback && callback(err,null);
      }
      console.log("DB: " + process.env.DBSERVER + " not open.. retrying");
      return setTimeout(_openDB,10000,tries + 1, callback);
    }
    callback(null,db);
   })
  }
}

module.exports = {
  openDB: function (tries,callback) {
    _openDB(0,callback);
  }
}
