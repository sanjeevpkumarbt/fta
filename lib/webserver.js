module.exports = {
  init: function () {
    var express = require('express');
    var bodyParser = require('body-parser');
    var app = express();

    app.use(express.static('html/public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    return app;
  },

  listen: function(app) {
    return app.listen(8081, function() {
      console.log("Webserver Started");
    });
  }
}
