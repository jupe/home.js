function Authentication(req, res, next) {
  
  var validateUser = function(validUser){
    if( !req.session.user ) return false;
    if( req.session.user.name === valildUser ) return true;
    return false;
  }
  var isLoggedUser = function(){
    if( !req.session.user ) return false;
    if( typeof(req.session.user.name)=='string') return true;
    if( typeof(req.session.user.groups)=='object') return true;
    return false;
  }
  function createSession(req)
  {
    //Special admin user for this application.
    // Regenerate session when signing in
    // to prevent fixation
    req.session.regenerate(function(){
      req.session.login = true;
      req.session.user = {
        timestamp: new Date(),
        name: req.body.name
      }
      console.log('Session regenerated');
    });
  }
  var login = function(req,res, next){
    console.log('login in progress');
    if( req.session.login ) {
      res.json({note: 'You are already logged in'});
    } else {
      if( req.body.username == 'admin' && req.body.password == 'admin' ) {
        console.log('login success');
        createSession(req);
        res.json({login: 'success'});
      } else {
        console.log('login denied');
        res.accessDenied();
      }
    }
  }
  var logout = function(req,res, next){
    console.log('logout in progress');
    if( req.session.login ) {
      req.session.login = false;
      req.session.destroy(function() {
        console.log('logout successfully');
        res.json({logout: 'success'});
      });
    } else {
      res.json({note: 'you didnt were logged in'});
    }
  }
  var validateGroup = function( validGroup ){
    if( !req.session.user ) return false;
    
    //admin group
    if( req.session.user.name == 'admin' ) return true;
    if( req.session.user.groups.indexOf('admin')>=0) return true;
    
    if( typeof(validGroup) == 'string') {
      if( req.session.user.groups.indexOf(validGroup)>=0 ) return true;
    } else {
      var i;
      for(i=0;i<validGroup.length;i++) {
        if( req.session.user.groups.indexOf(validGroup[i])>=0 ) return true;
      }
    }
    return false;
  }
  var validateUserOrGroup = function(validUser, validGroup){
    if( !req.session.user ) return false;
    if( req.session.user.name === valildUser ) return true;
    if( req.session.user.groups.indexOf(validGroup)>=0 ) return true;
    return false;
  }
  
  var renderNotImplemented = function(){
    
    res.status(501);
    if(req.accepts('html')) {
      
      res.send();
      //res.render('501', { url: req.url, image: img, user: req.session.user } );
      return;
    }
    // respond with json
    if (req.accepts('json')) {
      res.json({ error: 'Not found', req: req });
      return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not implemented');
  }
  var renderNotFound = function(){
    res.status(404);
    if(req.accepts('html')) {
      res.send();
      //res.render('404', { url: req.url, image: img, user: req.session.user } );
      return;
    }
    // respond with json
    if (req.accepts('json')) {
      res.json({ error: 'Not found', req: req.method+":"+req.url });
      return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not found');
  }
  var renderAccessDenied = function(){
    
    res.status(403);
    if(req.accepts('html')) {
      res.send();
      //res.render('403', { url: req.url, image: img, user: req.session.user } );
      return;
    }
    // respond with json
    if (req.accepts('json')) {
      res.json({ error: 'Access denied', req: req.method+":"+req.url });
      return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not found');
  }
  var renderNotSupported = function(){
    
    res.status(406);
    if(req.accepts('html')) {
      res.send();
      //res.render('406', { url: req.url, image: img, user: req.session.user } );
      return;
    }
    // respond with json
    if (req.accepts('json') ) {
      res.json({ error: 'Not supported', req: req.method+":"+req.url });
      return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not supported');
  }
  
  
  /* Response default rendered*/
  res.accessDenied = renderAccessDenied;
  res.notFound = renderNotFound;
  res.notImplemented = renderNotImplemented;
  res.notSupported = renderNotSupported;
  
  /* Request helper functions*/
  req.login = login;
  req.logout = logout;
  req.isLoggedUser = isLoggedUser;
  req.isValidUser = validateUser;
  req.isValidGroup = validateGroup;
  req.isValidUserOrGroup = validateUserOrGroup;
  next();
}

module.exports = exports = Authentication;