var basename  = require('path').basename;
var dirname   = require('path').dirname;
var extname   = require('path').extname;
var debug     = require('debug')('metalsmith-pandoc');
var pdcPath   = require('pandoc-bin').path;
var pdc       = require('pdc');
var minimatch = require('minimatch');
var each      = require('async-each');
var which     = require('which');
var fs        = require('fs');

// use pandoc-bin
pdc.path = pdcPath;
// check if installation of pandoc-bin is ok
fs.stat(pdcPath, function(err, stats){
  if (err || !isExecutable(stats.mode)) {
    console.log('metalsmith-pandoc: trouble with pandoc-bin installation');
    console.log('metalsmith-pandoc: trying to use system installed pandoc');
    // try to use system installed pandoc
    which('pandoc', function(err,cmd){
      if (!err) pdc.path = cmd;
      else console.log('metalsmith-pandoc: ERROR pandoc not found');
    });
  }
});

function isExecutable(mode){
  var unixMode = mode & 07777;
  return (unixMode % 2 == 1);
}


/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to convert files using pandoc.
 *
 */

function plugin(options){
  options = options || {};
  var from = options.from || 'markdown';
  var to   = options.to   || 'html5';
  var args = options.args || [];
  var opts = options.opts || [];
  var pattern = options.pattern || '**/*.md';
  var extension = options.ext || '.html';

  return function(files, metalsmith, done){
    each(Object.keys(files), function(file, cb){
      debug('Checking file: %s', file);
      if (!minimatch(file, pattern)) {
        cb(); // count
        return; // do nothing
      }
      var data = files[file];
      var dir = dirname(file);
      var html = basename(file, extname(file)) + extension;
      if ('.' != dir) html = dir + '/' + html;

      debug('Converting file %s', file);
      var md = data.contents.toString();
      pdc(md, from, to, args, opts, function(err,res){
        if (err){
          msg = 'metalsmith-pandoc: ' + file + ' - ' + err;
          debug(msg);
          cb(msg);
          return;
        }
        if (res === undefined || res === ''){
          var msg = 'ERROR: nothing returned from pandoc for file ' + file;
          debug(msg);
          cb(new Error(msg));
          return;
        }
        debug('Converted file %s. Converted: %s...', file, res.substring(0,10).replace('\n',''));
        data.contents = new Buffer(res);
        delete files[file];
        files[html] = data;
        cb();
      });
    }, done);
  };
}
