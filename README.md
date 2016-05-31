[![npm version](https://badge.fury.io/js/metalsmith-pandoc.svg)](https://badge.fury.io/js/metalsmith-pandoc) [![Build Status](https://travis-ci.org/arve0/metalsmith-pandoc.svg?branch=master)](https://travis-ci.org/arve0/metalsmith-pandoc)

# metalsmith-pandoc
Wrap around [pdc](https://github.com/pvorb/node-pdc). Pandoc needs to be [system installed](http://pandoc.org/installing.html).

## Install
```sh
npm install metalsmith-pandoc
```

## Usage
```js
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

## Credit
Stole code from [metalsmith-markdown](https://github.com/segmentio/metalsmith-markdown).
