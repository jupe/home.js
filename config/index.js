var fs = require('fs');

var copyFileSync = function(srcFile, destFile) {
  var BUF_LENGTH, buff, bytesRead, fdr, fdw, pos;
  BUF_LENGTH = 64 * 1024;
  buff = new Buffer(BUF_LENGTH);
  fdr = fs.openSync(srcFile, "r");
  fdw = fs.openSync(destFile, "w");
  bytesRead = 1;
  pos = 0;
  while (bytesRead > 0) {
    bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
    fs.writeSync(fdw, buff, 0, bytesRead);
    pos += bytesRead;
  }
  fs.closeSync(fdr);
  return fs.closeSync(fdw);
};

var resetConf = function(){
  copyFileSync(__dirname+'/config.template.json', __dirname+'/config.json');
}

var configExists = function(){

  if( fs.existsSync(__dirname+'/config.json') ){
    console.log('config exists');
    return true;
  } else if(fs.existsSync(__dirname+'/config.template.json') ) {
    console.debug('config not exists, but template exists');
    return false;
  } console.debug('config or template not exists');
}

var init = function(){
  switch( configExists()) {
    case(true): break;
    case(false): resetConf(); break;
    default:
          console.error('config file (config.template.json) missing.');
          process.exit(0);
          break;
  }
  var conf = require('./config.json');
  return conf;
}
    
module.exports.init = init;