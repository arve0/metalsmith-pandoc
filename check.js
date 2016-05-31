var debug     = require('debug')('metalsmith-pandoc');
var which     = require('which');
var install   = require('system-install')();

// Make sure pandoc is installed
which('pandoc', function(err, cmd){
  if (err) {
    // TODO: ask user to accept installation via system package manager.
    console.error('metalsmith-pandoc: ERROR, pandoc not found.');
    console.error('Install pandoc on your system with `' + install + ' pandoc`.');
    process.exit(1);
  }
  debug('Found pandoc: ' + cmd)
});
