var debug     = require('debug')('metalsmith-pandoc');
var which     = require('which');
var fs        = require('fs');
var pdc       = require('pdc');

// use system installed pandoc first
which('pandoc', function(err,cmd){
  if (!err) {
      debug('Found pandoc:' + cmd)
      pdc.path = cmd;
    }
  else {
    console.err('Please check that pandoc is installed on your system.')
    process.exit(1);
  }
});