//These are checks before we get into starting up the Server
if(process.env.KEYS == null || process.env.DBSERVER == null) {
  console.log("Err: Environment variables not set.")
  process.exit();
}
////////////////////////////////////////////////////////////

var ws = require('./lib/webserver.js');
var app = ws.init();
var server;

var dbconn = require('./lib/dbconn.js');
var dbhandle;
var db;

dbconn.openDB(0,function (error, res) {
  if (error)
    console.log("Unable to connect to the Database " + error.message);
  else {
    console.log("DBCONN is now set");
    dbhandle = res; // Setting DB Handle.
    db = dbhandle.db("optin"); //Setting db to point to the instance we are looking to write into.
    server = ws.listen(app);
    console.log("Server is listening at http://%s:%s", server.address().address, server.address().port);
  }
});

app.get('/',function(req,res){
  res.sendFile(__dirname + "/html/index.html");
  console.log("Accessed index.html");
})

app.get('/api/getUsers',function(req,res){
  db.collection("customers").find({}).toArray(function(err,result){
    if (err) throw err;
    var response = "";
    for(var i = 0;i < result.length;i++){
      response += "<tr><td>" + (i + 1) + "</td><td>" + result[i].name + "</td><td>" + result[i].address + "</td></tr>";
    }
    res.send(response);
  });
  console.log("Accessed getUsers");
})

app.post('/api/addUsers', function(req,res){
  var entry = {name:req.body.user,address:req.body.phone};
  db.collection("customers").insertOne(entry, function(err,res){
    if (err) throw err;
    console.log("1 document inserted")
  });
  res.send("Thanks for registering");
});

app.post('/api/searchUser', function(req,res){
  var response = "";
  console.log("Accessed searchUser");
    db.collection("customers").find({"name":req.body.string}).toArray(function(err,result){
      if (err) {
        throw err;
        console.log("This is server error")
        res.send("Server Error");
      }
      for(var i = 0;i < result.length;i++){
        response += "<tr><td>" + (i + 1) + "</td><td>" + result[i].name + "</td><td>" + result[i].address + "</td></tr>";
      }
      db.collection("customers").find({"address":req.body.string}).toArray(function(err,result2){
        if (err) {
          if (response.length == 0) {
            res.send("NO_RESULTS");
            console.log("this is no result");
          } else {
            res.send(response);
            console.log("This is intermediate error")
            throw err;
          }
        }
        else {
         for(var j = 0;j < result2.length;i++,j++){
           response += "<tr><td>" + (i + 1) + "</td><td>" + result2[j].name + "</td><td>" + result2[j].address + "</td></tr>";
         }
        }
        if (response.length == 0)  {
          res.send("NO_RESULTS");
          console.log("this is no result");
        }
        else {
          console.log("This is final result")
          res.send(response);
        }
      });
    });
});
