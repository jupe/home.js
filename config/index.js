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

var resetConf = function(cfgfile){
  copyFileSync(__dirname+'/config.template.json', cfgfile);
}

var configExists = function(file){
  if( fs.existsSync(file) ){
    return 'ok';
  } else if(fs.existsSync(__dirname+'/config.template.json') ) {
    return 'template';
  } else {
    console.error( ('config or template not exists').red);
    return false;
  }
}

var init = function(cliarg){
  var cfgfile = __dirname+'/config.json';
  if(cliarg.config) cfgfile = cliarg.config;
  switch( configExists(cfgfile)) {
    case('ok'): break;
    case('template'): 
      console.log('generate config from template..' .cyan);
      resetConf(cfgfile); break;
    default:
          console.error('config file (config.template.json) missing.');
          process.exit(0);
          break;
  }
  var conf = require('./config.json');
  return conf;
}
    
module.exports.init = init;