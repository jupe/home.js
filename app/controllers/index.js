/*
 * Default routes
 */
 
exports.index = function(req, res){
  res.render('index', { 
    session: req.session.browser
  });
}
exports.newUser = function(req, res)
{
    
}
exports.login = function (req, res) {
  
  if (req.body.username == 'admin' && req.body.password == 'admin') {
    console.log("login success!");
    req.session.regenerate(function(){
      
      req.session.browser = {
        user: {
          ame: req.body.username,
          group: 'admin'
        }
      };
      console.log('Session generated');
      res.json(req.session.browser);
    });
  } else {
    console.log("login fails!");
    res.json(403, {error: 'login fails'});
  }
  /*db.users.findOne({ username: req.body.user.name }, function(err, user) {
    if (user && user.authenticate(req.body.user.password)) {
      req.session.user = { name: user.name }

      // Remember me
      *
      if (req.body.remember_me) {
        var loginToken = new LoginToken({ email: user.email });
        loginToken.save(function() {
          res.cookie('logintoken', loginToken.cookieValue, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
          res.redirect('/documents');
        });
      } else {
      *
        res.redirect('back');
      //}
    } else {
      req.flash('error', 'Incorrect credentials');
      res.redirect('/');
    }
  }); 
  */
}
exports.logout = function (req, res) {
  req.session.destroy(function() {
    console.log('logout successfully');
    res.json({});
  });
}