var assert = require('assert');
var equal = require('assert-dir-equal');
var Metalsmith = require('metalsmith');
var pandoc = require('..');

describe('metalsmith-pandoc', function(){
  it('should convert markdown files', function(done){
    Metalsmith('test')
    .use(pandoc())
    .build(function(err){
      if (err) return done(err);
      equal('test/expected', 'test/build');
      done();
    });
  });
});
