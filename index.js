var basename  = require('path').basename;
var debug     = require('debug')('metalsmith-pandoc');
var dirname   = require('path').dirname;
var extname   = require('path').extname;
var pandoc    = require('pandoc-bin').path;
var pdc       = require('pdc');
var minimatch = require('minimatch');


// use pandoc-bin
pdc.path = pandoc;

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
    Object.keys(files).forEach(function(file){
      debug('checking file: %s', file);
      if (!minimatch(file, pattern)) return;
      var data = files[file];
      var dir = dirname(file);
      var html = basename(file, extname(file)) + '.html';
      if ('.' != dir) html = dir + '/' + html;

      debug('converting file: %s', file);
      pdc(data.contents.toString(), from, to, args, opts, function(err, str){
        debug('converted %s: %s', file, str.substring(0,20));
        if(err) return;
        data.contents = new Buffer(str);
        delete files[file];
        files[html] = data;
      });
    });
  };
}
