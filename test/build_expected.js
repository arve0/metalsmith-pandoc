var Metalsmith = require('metalsmith');
var pandoc = require('..');

Metalsmith('test')
.use(pandoc())
.destination('expected-html')
.build(function(err){
  if (err) console.log(err);
});

Metalsmith('test')
.use(pandoc({
  to:'rst',
  ext:'.rst'
}))
.destination('expected-rst')
.build(function(err){
  if (err) console.log(err);
});
