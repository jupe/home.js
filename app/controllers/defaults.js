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
  
  req.login(req, res);
}
exports.logout = function (req, res) {
  req.logout(req, res);
}