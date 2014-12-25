specify-assertions
==================

[![Build status](https://img.shields.io/travis/origamitower/specify-assertions/master.svg?style=flat)](https://travis-ci.org/origamitower/specify-assertions)
[![NPM version](https://img.shields.io/npm/v/specify-assertions.svg?style=flat)](https://npmjs.org/package/specify-assertions)
[![Dependencies status](https://img.shields.io/david/origamitower/specify-assertions.svg?style=flat)](https://david-dm.org/origamitower/specify-assertions)
![Licence](https://img.shields.io/npm/l/specify-assertions.svg?style=flat&label=licence)
![Stable API](https://img.shields.io/badge/API_stability-stable-green.svg?style=flat)

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

Using the Sweet.js macros:

```js
var _ = require('specify-assertions')

// simple assertions
add(a)(b) => a + b
add(a)(b) => not a + b

// anything goes assertions
add(a)(b) should _.equal(a + b)
add(a)(b) should not _.equal(a + b)

// asynchronous assertions with pure fantasy-land monads, or Promises/A+
asyncAdd(a)(b) will _.equal(a + b)
asyncAdd(a)(b) will not _.equal(a + b)
```

Using vanilla JavaScript:

```js
var _ = require('specify-assertions')

// Use verify for synchronous assertions
_.verify(add(a)(b))(_.equals(a + b))
_.verify(add(a)(b))(_.not(_.equals(a + b)))

// use verifyFuture for monadic Futures, and verifyPromise for Promises/A+
_.verifyMonad(asyncAdd(a)(b))(_.equals(a + b))
```


## Installing

    $ npm install specify-assertions


## Tests

    $ npm install
    $ make test


## Documentation

    $ npm install
    $ make documentation


## Platform support

This library assumes an ES5 environment, but can be easily supported in ES3
platforms by the use of shims. Just include [es5-shim][] :)


## Licence

Copyright (c) 2013-2014 [Origami Tower](http://www.origamitower.com).

This module is part of the [Specify framework][Specify], and released under the
[MIT](http://origami-tower.mit-license.org/) licence.

[Specify]: https://github.com/origamitower/specify
