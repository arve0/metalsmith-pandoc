var basename  = require('path').basename;
var dirname   = require('path').dirname;
var extname   = require('path').extname;
var debug     = require('debug')('metalsmith-pandoc');
var pdcPath   = require('pandoc-bin').path;
var pdc       = require('pdc');
var minimatch = require('minimatch');
var Sync      = require('sync');


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
    Sync(function(){
      Object.keys(files).forEach(function(file){
        debug('checking file: %s', file);
        if (!minimatch(file, pattern)) return;
        var data = files[file];
        var dir = dirname(file);
        var html = basename(file, extname(file)) + '.html';
        if ('.' != dir) html = dir + '/' + html;

        debug('converting file: %s', file);
        var str = pdc.sync(null, data.contents.toString(), from, to, args, opts);
        debug('converted %s: %s...', file, str.substring(0,25));
        data.contents = new Buffer(str);
        delete files[file];
        files[html] = data;
      });
      debug('done');
      done();
    })
  };
}
