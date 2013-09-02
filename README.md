Brofist-ensure
==============

[![unstable](http://hughsk.github.io/stability-badges/dist/unstable.svg)](http://github.com/hughsk/stability-badges)
[![Build Status](https://travis-ci.org/brofistjs/brofist-ensure.png)](https://travis-ci.org/brofistjs/brofist-ensure)
![Dependencies Status](https://david-dm.org/brofistjs/brofist-ensure.png)

A BDD-style assertion library, minus the verbosity. Made to work beautifully in
all JavaScript platforms (including dubious ones, like IE6's JScript ;P)


## Example

( ... )


## Installing

Just grab it from NPM:

    $ npm install brofist-ensure
    

## Documentation

A quick reference of the API can be built using [Calliope][]:

    $ npm install -g calliope
    $ calliope build


## Tests

On Node:

    $ npm test
    
On the browser:

    $ npm install -g brofist-browser
    $ brofist-browser serve test/specs/index.js
    # Then open the link on any browser


## Platform support

This library assumes an ES5 environment, but can be easily supported in ES3
platforms by the use of shims. Just include [es5-shim][] :3

[![browser support](https://ci.testling.com/brofistjs/brofist-ensure.png)](http://ci.testling.com/brofistjs/brofist-ensure)

[es5-shim]: https://github.com/kriskowal/es5-shim

## Licence

MIT/X11. ie.: do whatever you want.
