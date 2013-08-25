var Middleware = {
  isAdmin: function(req, res, next){
    if( req.isValidGroup('admin') ) {
      next();
      return;
    }
    console.log('access denied');
    res.accessDenied();
  },
  session: function(req, res){
    if( req.session.login ) {
      res.json(req.session);
    } else {
      res.json({});
    }
  },
  me: function(req, res){
    if( req.session.login ) {
      res.redirect('/user/'+req.session.user.name+'.json');
    } else {
      res.send(404);
    }
  }
}
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
  function createSession( user, cb)
  {
    //Special admin user for this application.
    // Regenerate session when signing in
    // to prevent fixation
    var req = this;
    console.log(user);
    req.session.regenerate(function(){
      req.session.login = true;
      req.session.user = {
        timestamp: new Date(),
        name: user.name,
        group: user.group
      }
      console.log('Session regenerated');
      cb();
    });
  }
  var logout = function(req, next){
    console.log('logout in progress');
    if( req.session.login ) {
      req.session.login = false;
      req.session.destroy(function() {
        console.log('logout successfully');
        next(null, 'ok');
      });
    } else {
      next(null, 'you didnt were logged in');
    }
  }
  var validateGroup = function( validGroup ){
    if( !req.session.user ) return false;
    //admin group
    if( req.session.user.name === 'admin' ) return true;
    if( req.session.user.groups.indexOf('admin')>=0) return true;
    
    if( typeof(validGroup) === 'string') {
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
  //req.login = login;
  req.createSession = createSession;
  req.isLoggedUser = isLoggedUser;
  req.logout = logout;
  
  req.isValidUser = validateUser;
  req.isValidGroup = validateGroup;
  req.isValidUserOrGroup = validateUserOrGroup;
  next();
}

module.exports  = Authentication;
module.exports.Middleware = Middleware;