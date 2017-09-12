var assert = require('assert');
var equal = require('assert-dir-equal');
var Metalsmith = require('metalsmith');
var pandoc = require('..');
var fs = require('fs');

describe('metalsmith-pandoc', function(){
  it('should convert markdown files to html', function(done){
    Metalsmith('test')
    .use(pandoc())
    .destination('build-html')
    .build(function(err){
      if (err) return done(err);
      equal('test/build-html', 'test/expected-html');
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
      equal('test/build-rst', 'test/expected-rst');
      done();
    });
  });

  it('should be able to process 20 thousand files', function(done){
    var many = 20000;
    this.timeout(0);

    Metalsmith('test')
    .destination('out')
    .concurrency(1000)  // avoid file table overflow (ENFILE)
    .use(function (files) {
      // add fake files
      for (var i = 0; i < many; i += 1) {
        var filename = i + '.md';
        files[filename] = {
          title: 'fake ' + i,
          contents: 'sample markdown'
        };
      }
    })
    .use(pandoc({
      pattern: '**/*.html'  // do not match the files
    }))
    .build(function(err){
      if (err) return done(err);
      assert.equal(fs.readdirSync('test/out').length, many + 1);
      done();
    });
  });
});
