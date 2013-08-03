module.exports = function(app){
  var data = require('./../resources/data');
  var devicesResource = app.resource('data', data);

  app.get('/mailtest', function(req,res){
      console.log("mailtest..");
      var cfg = CFG.email;
      var server   = email.server.connect( cfg );
      server.send( {
          text: 'test',
          from: cfg.from,
          to: 'jussiva@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field. 
          subject: 'Test Email', // REQUIRED.
        }, function (err, message) {
          if (err) {
            // handle error
            console.log(err);
            res.send('There was an error sending the email');
            return;
          }
          res.send(message);
        });
  });
}
module.exports.disable = true;