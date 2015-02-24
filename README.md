# metalsmith-pandoc
Wrap around pdc. Uses same arguments as [pdc](https://github.com/pvorb/node-pdc). Pandoc doesn't need to be system installed, the package requires pandoc-bin and sets path for pdc to pandoc-bin.

# Install
`npm install metalsmith-pandoc`

# Usage
```
pandoc = require('metalsmith-pandoc');

Metalsmith(__dirname)
.use(pandoc())
...
```

As default, plugin will use these settings:
```
options = {
  from: 'markdown',
  to:   'html5',
  args: [],
  opts: [],
  pattern: '**/*.md', // minimatch
  ext: '.html' // extension for output file
};
```

For overriding the defaults, pass an object to plugin:
```
.use(pandoc({
  pattern: 'html/**/*.rst',
  from: 'rst',
  to: 'markdown',
  ext: '.md'
}))
```
See [pdc](https://github.com/pvorb/node-pdc#api) and [pandoc](http://johnmacfarlane.net/pandoc/README.html) for more detailed description of options.

# Credit
Stealed code from [metalsmith-markdown](https://github.com/segmentio/metalsmith-markdown).
