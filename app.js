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
var db;

dbconn.openDB(0,function (error, res) {
  if (error)
    console.log("Unable to connect to the Database " + error.message);
  else {
    console.log("DBCONN is set");
    db = res;
    server = ws.listen(app);
    console.log("Server is listening at http://%s:%s", server.address().address, server.address().port);
  }
});

app.get('/',function(req,res){
  res.sendFile(__dirname + "/html/index.html");
  console.log("Accessed index.html");
})

app.post('/api/addUsers', function(req,res){
  console.log(req.body.user + req.body.phone);
  res.send("Thanks for registering");
});
