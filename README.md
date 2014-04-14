alright
=======

[![Build Status](https://secure.travis-ci.org/robotlolita/alright.png?branch=master)](https://travis-ci.org/robotlolita/alright)
[![NPM version](https://badge.fury.io/js/alright.png)](http://badge.fury.io/js/alright)
[![Dependencies Status](https://david-dm.org/robotlolita/alright.png)](https://david-dm.org/robotlolita/alright)
[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)


Beautiful assertion library.


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

```ls
{ alright, equals } = require('alright')

alright (typeof 'foo' |> equals 'string')
```


## Installing

The easiest way is to grab it from NPM. If you're running in a Browser
environment, you can use [Browserify][]

    $ npm install alright


### Using with CommonJS

If you're not using NPM, [Download the latest release][release], and require
the `alright.umd.js` file:

```js
var Alright = require('alright')
```


### Using with AMD

[Download the latest release][release], and require the `alright.umd.js`
file:

```js
require(['alright'], function(Alright) {
  ( ... )
})
```


### Using without modules

[Download the latest release][release], and load the `alright.umd.js`
file. The properties are exposed in the global `Alright` object:

```html
<script src="/path/to/alright.umd.js"></script>
```


### Compiling from source

If you want to compile this library from the source, you'll need [Git][],
[Make][], [Node.js][], and run the following commands:

    $ git clone git://github.com/robotlolita/alright.git
    $ cd alright
    $ npm install
    $ make bundle
    
This will generate the `dist/alright.umd.js` file, which you can load in
any JavaScript environment.

    
## Documentation

You can [read the documentation online][docs] or build it yourself:

    $ git clone git://github.com/robotlolita/alright.git
    $ cd alright
    $ npm install
    $ make documentation

Then open the file `docs/index.html` in your browser.


## Platform support

This library assumes an ES5 environment, but can be easily supported in ES3
platforms by the use of shims. Just include [es5-shim][] :)

[![browser support](http://ci.testling.com/robotlolita/alright.png)](http://ci.testling.com/robotlolita/alright)

## Licence

Copyright (c) 2014 Quildreen Motta.

Released under the [MIT licence](https://github.com/robotlolita/alright/blob/master/LICENCE).

<!-- links -->
[Fantasy Land]: https://github.com/fantasyland/fantasy-land
[Browserify]: http://browserify.org/
[Git]: http://git-scm.com/
[Make]: http://www.gnu.org/software/make/
[Node.js]: http://nodejs.org/
[es5-shim]: https://github.com/kriskowal/es5-shim
[docs]: http://robotlolita.github.io/alright
<!-- [release: https://github.com/robotlolita/alright/releases/download/v$VERSION/alright-$VERSION.tar.gz] -->
[release]: https://github.com/robotlolita/alright/releases/download/v0.0.0/alright-0.0.0.tar.gz
<!-- [/release] -->
