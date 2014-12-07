var basename  = require('path').basename;
var dirname   = require('path').dirname;
var extname   = require('path').extname;
var debug     = require('debug')('metalsmith-pandoc');
var pdcPath   = require('pandoc-bin').path;
var pdc       = require('pdc');
var minimatch = require('minimatch');
var async     = require('async');


// use pandoc-bin
pdc.path = pdcPath;

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
  var to   = options.to   || 'html';
  var args = options.args || [];
  var opts = options.opts || [];
  var pattern = options.pattern || '**/*.md';

  return function(files, metalsmith, done){
    async.each(Object.keys(files), function(file, cb){
      debug('Checking file: %s', file);
      if (!minimatch(file, pattern)) {
        cb(); // count
        return; // do nothing
      }
      var data = files[file];
      var dir = dirname(file);
      var html = basename(file, extname(file)) + '.html';
      if ('.' != dir) html = dir + '/' + html;

      debug('Converting file: %s', file);
      var md = data.contents.toString();
      pdc(md, from, to, args, opts, function(err,res){
        if (err) debug('ERROR: %s', err);
        if (res == '') {
          debug('WARNING: Empty string from pdc. String sent: %s', md.substring(0,10));
        }
        debug('Converted %s: %s...', file, res.substring(0,25));
        data.contents = new Buffer(res);
        delete files[file];
        files[html] = data;
        cb(err);
      });
    }, done);
  };
}
