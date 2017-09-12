var basename  = require('path').basename;
var dirname   = require('path').dirname;
var extname   = require('path').extname;
var debug     = require('debug')('metalsmith-pandoc');
var pdc       = require('pdc');
var match     = require('multimatch');
var async     = require('async');
var which     = require('which');
var install   = require('system-install')();

// check if pandoc is installed
try {
  pdc.path = which.sync('pandoc');
} catch (e) {
  var err = 'metalsmith-pandoc: ERROR, pandoc not found. ';
  err += 'Install pandoc on your system with `' + install + ' pandoc`.';
  // fail hard
  throw new Error(err)
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
    selectedFiles = match(Object.keys(files), pattern)
    async.eachLimit(selectedFiles, 100, function(file, cb){

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
