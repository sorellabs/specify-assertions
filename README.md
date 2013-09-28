Alright!
========

[![Build Status](https://travis-ci.org/hifivejs/alright.png)](https://travis-ci.org/hifivejs/alright)
[![Dependencies Status](https://david-dm.org/hifivejs/alright.png)](https://david-dm.org/hifivejs/alright.png)
[![NPM version](https://badge.fury.io/js/alright.png)](http://badge.fury.io/js/alright)
[![stable](http://hughsk.github.io/stability-badges/dist/stable.svg)](http://github.com/hughsk/stability-badges)


[![browser support](http://ci.testling.com/hifivejs/alright.png)](http://ci.testling.com/hifivejs/alright)

The simplest and loveliest way of writing tests in JavaScript (or LiveScript) :)


## Philosophy

  - **Straight-forward**: Alright should get out of your way and just let you
    define your tests with what you already know: plain JavaScript.

  - **No verbosity**: We don't want `expect(x).to.eventually.be.boring...`

  - **Helpful error messages**: When things go wrong, Alright should do its
    best to show you exactly what's wrong and how you might fix it.

  - **Test-framework agnostic**: Alright should work with anything that expect
    Errors to be thrown when assertions fail.

  - **Extensible**: It should be easy to extend the built-in assertions with
    plain JavaScript.

  - **Work with older Browsers**: Some people still need to support old IEs,
    Alright should work on them.



## Example

```js
var alright = require('alright')

// You need to compile stuff to use the lovely assertion style:
alright.compile(function() {

  alright('foo' instanceof String)
  alright(deepEqual(bar, 'foo'))
  alright(foo.length === 3)
  alright(foo.flavours.length === 3)

})

// Or you can go with the raw thing, like, your choice eh
alright.is(foo === 'x', 'Asserts that `foo` equals `x`')
```


## Installing

The easiest way is to grab it from NPM (if you're in the Browser, use [Browserify][]):

    $ npm install alright
    
If you don't want to use NPM and/or Browserify, you'll need to compile the
library yourself. You'll need [Git][], [Make][] and [Node.js][]:

    $ git clone git://github.com/hifivejs/alright.git
    $ cd alright
    $ npm install
    $ make bundle
    
And use the `dist/alright.umd.js` file without a module system, or with an
AMD module system like Require.js.
    
[Browserify]: http://browserify.org/
[Git]: http://git-scm.com/
[Make]: http://www.gnu.org/software/make/
[Node.js]: http://nodejs.org/

    

## Documentation

You can either [check the documentation on-line][docs], or build them
locally. To build the documentation you'll need to install [type.writer][], and [Node.js][]:

    $ npm install
    $ make documentation
    
This will generate the documentation as a series of HTML files on
`docs/build`.

[type.writer]: http://kurisuwhyte.github.io/type.writer
[docs]: http://hifivejs.github.io/alright


## Tests

On Node:

    $ npm test
    
On the browser:

    $ npm install -g brofist-browser
    $ brofist-browser serve test/specs/index.js
    # Then open the link on any browser


## Platform support

This library assumes an ES5 environment, but can be easily supported in ES3
platforms by the use of shims. Just include [es5-shim][] :)

[es5-shim]: https://github.com/kriskowal/es5-shim

## Licence

Copyright (c) 2013 Quildreen Motta.

Released under the [MIT licence](https://github.com/hifivejs/alright/blob/master/LICENCE).

