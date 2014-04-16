// Copyright (c) 2014 Quildreen Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var spec    = require('hifive')()
var alright = require('../../lib')
var claire  = require('claire')
var k       = require('core.lambda').constant

// Aliases
var _      = alright
var t      = claire.data
var forAll = claire.forAll

// Data types
var Any = claire.sized(k(10), t.Any)

// Specification
module.exports = spec('Validations', function(it, spec) {

  spec('assert()', function(it) {
    var divergence = _.divergence.Divergence

    it( 'Should create a successful validation if the assertion is true.'
      , function() {
          _.assert(true, divergence).isSuccess => true
          _.assert(true, divergence).get()     => divergence
        })

    it( 'Should create a failed validation if the assertion fails.'
      , function() {
          _.assert(false, divergence).isFailure => true
          _.assert(false, divergence).merge()   => divergence
        })
  })

})
