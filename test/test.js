var assert = require('assert');
var equal = require('assert-dir-equal');
var Metalsmith = require('metalsmith');
var pandoc = require('..');

describe('metalsmith-pandoc', function(){
  it('should convert markdown files', function(done){
    Metalsmith('test')
    .use(pandoc())
    .destination('build-html')
    .build(function(err){
      if (err) return done(err);
      equal('test/expected-html', 'test/build-html');
      done();
    });
  });

  it('should convert markdown files to reStructuredText', function(done){
    Metalsmith('test')
    .use(pandoc({
      to: 'rst',
      ext: '.rst'
    }))
    .destination('build-rst')
    .build(function(err){
      if (err) return done(err);
      equal('test/expected-rst', 'test/build-rst');
      done();
    });
  });
});
