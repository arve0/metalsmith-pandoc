var Metalsmith = require('metalsmith');
var pandoc = require('..');

Metalsmith('test')
.use(pandoc())
.destination('expected')
.build(function(err){
  if (err) console.log(err);
});
