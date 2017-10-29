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

      pandoc = pdc.stream(from, to, args, opts);

      var result = new Buffer(0);
      var chunks = [];
      var size = 0;
      var error = '';

      // listen on error
      pandoc.on('error', function (err) {
        debug('error: ', err);
        return cb(err);
      });

      // collect result data
      pandoc.stdout.on('data', function (data) {
        chunks.push(data);
        size += data.length;
      });

      // collect error data
      pandoc.stderr.on('data', function (data) {
        error += data;
      });

      // listen on exit
      pandoc.on('close', function (code) {
        var msg = '';
        if (code !== 0)
          msg += 'pandoc exited with code ' + code + (error ? ': ' : '.');
        if (error)
          msg += error;

        if (msg)
          return cb(new Error(msg));

        var result = Buffer.concat(chunks, size);

        data.contents = result;
        delete files[file];
        files[html] = data;
        cb(null, result);
      });

      // finally, send source string
      pandoc.stdin.end(md, 'utf8');

    }, done);
  };
}
